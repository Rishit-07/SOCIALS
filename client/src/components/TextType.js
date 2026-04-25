import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

const TextType = ({
    text,
    as: Component = 'div',
    typingSpeed = 50,
    typingSpeeds,
    initialDelay = 0,
    pauseDuration = 2000,
    deletingSpeed = 30,
    deletingSpeeds,
    loop = true,
    className = '',
    showCursor = true,
    hideCursorWhileTyping = false,
    cursorCharacter = '|',
    cursorClassName = '',
    cursorBlinkDuration = 0.5,
    textColors = [],
    highlightWords = [],
    highlightColor = '#ff4d4f',
    variableSpeed,
    onSentenceComplete,
    onTypingComplete,
    onDeleteComplete,
    deleteOnComplete = false,
    startOnVisible = false,
    reverseMode = false,
    ...props
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(!startOnVisible);
    const cursorRef = useRef(null);
    const containerRef = useRef(null);
    const completionRef = useRef({ textIndex: -1, charIndex: -1 });
    const deleteCompletionRef = useRef({ textIndex: -1 });

    const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

    const getRandomSpeed = useCallback(() => {
        if (!variableSpeed) return typingSpeed;
        const { min, max } = variableSpeed;
        return Math.random() * (max - min) + min;
    }, [variableSpeed, typingSpeed]);

    const getTypingSpeed = useCallback(
        (textIndex) => {
            if (Array.isArray(typingSpeeds) && typingSpeeds[textIndex] != null) {
                return typingSpeeds[textIndex];
            }

            return typingSpeed;
        },
        [typingSpeeds, typingSpeed]
    );

    const getDeletingSpeed = useCallback(
        (textIndex) => {
            if (Array.isArray(deletingSpeeds) && deletingSpeeds[textIndex] != null) {
                return deletingSpeeds[textIndex];
            }

            return deletingSpeed;
        },
        [deletingSpeeds, deletingSpeed]
    );

    const getCurrentTextColor = () => {
        if (textColors.length === 0) return 'inherit';
        return textColors[currentTextIndex % textColors.length];
    };

    const renderHighlightedText = (value) => {
        if (!highlightWords.length || !value) {
            return value;
        }

        const normalizedWords = highlightWords.filter(Boolean);

        if (!normalizedWords.length) {
            return value;
        }

        const renderedParts = [];
        let index = 0;

        while (index < value.length) {
            let matchLength = 0;

            for (const word of normalizedWords) {
                const remainingText = value.slice(index);
                const sharedLength = Math.min(word.length, remainingText.length);
                let currentMatchLength = 0;

                while (
                    currentMatchLength < sharedLength &&
                    word[currentMatchLength] === remainingText[currentMatchLength]
                ) {
                    currentMatchLength += 1;
                }

                if (currentMatchLength > matchLength) {
                    matchLength = currentMatchLength;
                }
            }

            if (matchLength > 0) {
                renderedParts.push(
                    <span key={`highlight-${index}`} style={{ color: highlightColor }}>
                        {value.slice(index, index + matchLength)}
                    </span>
                );
                index += matchLength;
            } else {
                renderedParts.push(<span key={`plain-${index}`}>{value[index]}</span>);
                index += 1;
            }
        }

        return renderedParts;
    };

    useEffect(() => {
        if (!startOnVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [startOnVisible]);

    useEffect(() => {
        if (showCursor && cursorRef.current) {
            gsap.set(cursorRef.current, { opacity: 1 });
            gsap.to(cursorRef.current, {
                opacity: 0,
                duration: cursorBlinkDuration,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
            });
        }
    }, [showCursor, cursorBlinkDuration]);

    useEffect(() => {
        if (!isVisible) return;

        let timeout;
        const currentText = textArray[currentTextIndex];
        const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

        const executeTypingAnimation = () => {
            if (isDeleting) {
                if (displayedText === '') {
                    setIsDeleting(false);
                    if (currentTextIndex === textArray.length - 1 && !loop) {
                        if (
                            deleteOnComplete &&
                            onDeleteComplete &&
                            deleteCompletionRef.current.textIndex !== currentTextIndex
                        ) {
                            deleteCompletionRef.current = { textIndex: currentTextIndex };
                            onDeleteComplete(textArray[currentTextIndex], currentTextIndex);
                        }

                        return;
                    }

                    if (onSentenceComplete) {
                        onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
                    }

                    setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
                    setCurrentCharIndex(0);
                    timeout = setTimeout(() => {}, pauseDuration);
                } else {
                    timeout = setTimeout(() => {
                        setDisplayedText((prev) => prev.slice(0, -1));
                    }, deletingSpeed);
                }
            } else {
                if (currentCharIndex < processedText.length) {
                    timeout = setTimeout(
                        () => {
                            setDisplayedText((prev) => prev + processedText[currentCharIndex]);
                            setCurrentCharIndex((prev) => prev + 1);
                        },
                        variableSpeed ? getRandomSpeed() : getTypingSpeed(currentTextIndex)
                    );
                } else if (textArray.length >= 1) {
                    if (
                        onTypingComplete &&
                        completionRef.current.textIndex !== currentTextIndex &&
                        completionRef.current.charIndex !== currentCharIndex
                    ) {
                        completionRef.current = {
                            textIndex: currentTextIndex,
                            charIndex: currentCharIndex,
                        };
                        onTypingComplete(textArray[currentTextIndex], currentTextIndex);
                    }

                    if (!loop && currentTextIndex === textArray.length - 1) {
                        if (deleteOnComplete) {
                            timeout = setTimeout(() => {
                                setIsDeleting(true);
                            }, pauseDuration);
                        }

                        return;
                    }
                    timeout = setTimeout(() => {
                        setIsDeleting(true);
                    }, pauseDuration);
                }
            }
        };

        if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
            timeout = setTimeout(executeTypingAnimation, initialDelay);
        } else {
            executeTypingAnimation();
        }

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentCharIndex,
        displayedText,
        isDeleting,
        typingSpeed,
        typingSpeeds,
        deletingSpeed,
        deletingSpeeds,
        pauseDuration,
        textArray,
        currentTextIndex,
        loop,
        initialDelay,
        isVisible,
        reverseMode,
        variableSpeed,
        onSentenceComplete,
        onTypingComplete,
        onDeleteComplete,
        deleteOnComplete,
    ]);

    const shouldHideCursor =
        hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

    return createElement(
        Component,
        {
            ref: containerRef,
            className: `text-type ${className}`,
            ...props,
        },
        <span className="text-type__content" style={{ color: getCurrentTextColor() || 'inherit' }}>
            {renderHighlightedText(displayedText)}
        </span>,
        showCursor && (
            <span
                ref={cursorRef}
                className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
            >
                {cursorCharacter}
            </span>
        )
    );
};

export default TextType;