import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

export const TypewriterText = ({
  phrases = [
    "OpenShift & Kubernetes Specialist",
    "Senior DevOps Engineer & Team Lead @ DXC",
    "GitOps & ArgoCD Delivery Architect",
    "SRE & High-Availability Practitioner (99.99%)",
    "Automate everything. Monitor ruthlessly. Fail fast.",
  ],
  typingSpeed = 65,
  deletingSpeed = 35,
  pauseDelay = 2200,
  className = ""
}) => {
  const [currentText, setCurrentText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentPhrase = phrases[phraseIdx % phrases.length];

    if (!isDeleting) {
      if (currentText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1));
          if (Math.random() > 0.4) {
            sound.playKey();
          }
        }, typingSpeed + (Math.random() * 20 - 10));
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDelay);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentPhrase.substring(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setPhraseIdx(prev => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseDelay]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{currentText}</span>
      <span className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 ml-1 bg-cyber-cyan animate-blink align-middle shadow-glow-cyan" />
    </span>
  );
};
