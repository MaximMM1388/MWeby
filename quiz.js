// =====================================
// quiz.js - Logika Kvízu s Vylepšeným Vyhodnotením a CTA
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizContainer = document.getElementById('quiz-container');
    const quizIntroCard = document.querySelector('.quiz-intro-card');
    const messageBox = document.getElementById('message-box'); // Predpokladá existenciu tohto elementu v HTML
    const messageText = document.getElementById('message-text');
    const messageCloseBtn = document.getElementById('message-close-btn');

    if (!startQuizBtn || !quizContainer || !quizIntroCard) {
        console.warn("Kvízové elementy neboli nájdené. Kvíz nebude funkčný.");
        return; // Zastaví vykonávanie, ak chýbajú kľúčové elementy
    }

    // Funkcia na zobrazenie vlastného upozornenia namiesto alert()
    const showMessageBox = (message) => {
        if (messageBox && messageText) {
            messageText.textContent = message;
            messageBox.classList.add('is-visible');
        }
    };

    // Funkcia na skrytie vlastného upozornenia
    const hideMessageBox = () => {
        if (messageBox) {
            messageBox.classList.remove('is-visible');
        }
    };

    // Pridanie event listenera pre zatvorenie správy
    if (messageCloseBtn) {
        messageCloseBtn.addEventListener('click', hideMessageBox);
    }
    // Skrytie správy pri kliknutí mimo nej (voliteľné, ale dobré pre UX)
    if (messageBox) {
        messageBox.addEventListener('click', (e) => {
            if (e.target === messageBox) { // Kliknutie priamo na overlay
                hideMessageBox();
            }
        });
    }


    const quizQuestions = [
        {
            question: "Prečo uvažujete o webstránke pre váš biznis?",
            options: [
                "Chcem získať nových zákazníkov online.",
                "Potrebujem online vizitku pre existujúcich klientov.",
                "Chcem predávať produkty/služby priamo cez web (E-shop).",
                "Chcem posilniť svoju značku a dôveryhodnosť.",
                "Potrebujem platformu pre blog/obsah."
            ],
            type: "checkbox" // Umožňuje viacero odpovedí
        },
        {
            question: "Aké sú vaše očakávania od dizajnu webstránky?",
            options: [
                "Moderný a minimalistický.",
                "Kreatívny a plný animácií.",
                "Jednoduchý a funkčný.",
                "Luxusný a prémiový."
            ],
            type: "radio" // Iba jedna odpoveď
        },
        {
            question: "Akú funkcionalitu považujete za najdôležitejšiu?",
            options: [
                "Kontaktný formulár a mapu.",
                "Galériu obrázkov/videí.",
                "Rezervačný systém/Online kalendár.",
                "Online platby.",
                "Sekciu s blogom/novinkami."
            ],
            type: "checkbox"
        },
        {
            question: "Aký je váš predpokladaný rozpočet pre tvorbu webstránky?",
            options: [
                "Do 300 EUR (jednoduchá vizitka).",
                "300 - 800 EUR (základná firemná stránka).",
                "800 - 1500 EUR (komplexnejšia stránka/menší E-shop).",
                "Viac ako 1500 EUR (rozsiahly projekt/väčší E-shop)."
            ],
            type: "radio"
        },
        {
            question: "Plánujete webstránku pravidelne aktualizovať alebo pridávať nový obsah?",
            options: [
                "Áno, plánujem aktívny blog/novinky.",
                "Len občas, keď to bude potrebné.",
                "Nie, stačí jednorazové vytvorenie."
            ],
            type: "radio"
        }
    ];

    let currentQuestionIndex = 0;
    let userAnswers = {};

    const renderQuestion = () => {
        // Log pre sledovanie, ktorá otázka sa renderuje
        console.log("renderQuestion called. Current Index:", currentQuestionIndex);

        const q = quizQuestions[currentQuestionIndex];
        if (!q) {
            // Ak už nie sú žiadne ďalšie otázky, zobraz výsledky
            console.log("No more questions. Calling showResults().");
            showResults();
            return;
        }

        let optionsHtml = '';
        if (q.type === 'radio') {
            optionsHtml = q.options.map((option, idx) => `
                <label>
                    <input type="radio" name="quiz-q${currentQuestionIndex}" value="${option}" ${userAnswers[`quiz-q${currentQuestionIndex}`] === option ? 'checked' : ''} required>
                    <span>${option}</span>
                </label>
            `).join('');
        } else if (q.type === 'checkbox') {
            optionsHtml = q.options.map((option, idx) => {
                const checked = userAnswers[`quiz-q${currentQuestionIndex}`] && userAnswers[`quiz-q${currentQuestionIndex}`].includes(option) ? 'checked' : '';
                return `
                    <label>
                        <input type="checkbox" name="quiz-q${currentQuestionIndex}" value="${option}" ${checked}>
                        <span>${option}</span>
                    </label>
                `;
            }).join('');
        }

        const quizCardHtml = `
            <div class="quiz-question-card is-visible">
                <h3>${q.question}</h3>
                <div class="quiz-options">
                    ${optionsHtml}
                </div>
                <div class="quiz-navigation-btns">
                    ${currentQuestionIndex > 0 ? `<button class="btn btn-secondary" id="prev-question-btn">Späť</button>` : ''}
                    <button class="btn btn-primary" id="next-question-btn">${currentQuestionIndex === quizQuestions.length - 1 ? 'Zobraziť Výsledky' : 'Ďalej'}</button>
                </div>
            </div>
        `;

        // Odstránenie predchádzajúcej karty s animáciou
        const currentCard = quizContainer.querySelector('.quiz-question-card, .quiz-intro-card, .quiz-results-card');
        if (currentCard) {
            currentCard.classList.remove('is-visible');
            setTimeout(() => {
                currentCard.remove();
                quizContainer.innerHTML = quizCardHtml;
                setTimeout(() => {
                    quizContainer.querySelector('.quiz-question-card').classList.add('is-visible');
                }, 50); // Krátky delay pre CSS animáciu
                attachEventListeners();
            }, 300); // Časovanie pre animáciu fade-out
        } else {
            // Ak nie je žiadna karta, len vlož novú
            quizContainer.innerHTML = quizCardHtml;
            setTimeout(() => {
                quizContainer.querySelector('.quiz-question-card').classList.add('is-visible');
            }, 50);
            attachEventListeners();
        }
    };

    const attachEventListeners = () => {
        const nextBtn = document.getElementById('next-question-btn');
        const prevBtn = document.getElementById('prev-question-btn');
        const options = quizContainer.querySelectorAll('.quiz-options input');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let isValid = false;
                const currentQuestion = quizQuestions[currentQuestionIndex];

                if (currentQuestion.type === 'radio') {
                    const selectedOption = quizContainer.querySelector(`input[name="quiz-q${currentQuestionIndex}"]:checked`);
                    if (selectedOption) {
                        userAnswers[`quiz-q${currentQuestionIndex}`] = selectedOption.value;
                        isValid = true;
                    }
                } else if (currentQuestion.type === 'checkbox') {
                    const selectedOptions = Array.from(quizContainer.querySelectorAll(`input[name="quiz-q${currentQuestionIndex}"]:checked`)).map(input => input.value);
                    
                    // Ak je checkbox otázka povinná a nič nie je vybrané
                    if (currentQuestion.required && selectedOptions.length === 0) {
                        isValid = false;
                    } else {
                        userAnswers[`quiz-q${currentQuestionIndex}`] = selectedOptions;
                        isValid = true;
                    }
                }

                console.log("Next/Results button clicked. Current isValid:", isValid, "Current Index (before increment):", currentQuestionIndex, "Total Questions:", quizQuestions.length);
                
                if (isValid) {
                    currentQuestionIndex++;
                    renderQuestion();
                } else {
                    showMessageBox("Prosím, vyberte aspoň jednu možnosť.");
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentQuestionIndex--;
                renderQuestion();
            });
        }
        
        options.forEach(option => {
            option.addEventListener('change', () => {
                if (option.type === 'radio') {
                    userAnswers[`quiz-q${currentQuestionIndex}`] = option.value;
                    if (currentQuestionIndex < quizQuestions.length - 1) {
                        setTimeout(() => {
                            currentQuestionIndex++;
                            renderQuestion();
                        }, 200);
                    }
                }
            });
        });
    };

    // Nová funkcia na generovanie dynamickej úvodnej vety
    const generateDynamicIntroSentence = (answers) => {
        let sentence = "Na základe vašich odpovedí veríme, že MWeby je pre vás ideálnym partnerom. ";
        
        const primaryGoals = answers['quiz-q0'] || [];
        const designExpectations = answers['quiz-q1'];
        const functionality = answers['quiz-q2'] || [];
        const budget = answers['quiz-q3'];
        const updateFrequency = answers['quiz-q4'];

        let goalPart = [];
        if (primaryGoals.includes("Chcem získať nových zákazníkov online.")) {
            goalPart.push("vám priláka zákazníkov");
        }
        if (primaryGoals.includes("Potrebujem online vizitku pre existujúcich klientov.") || primaryGoals.includes("Chcem posilniť svoju značku a dôveryhodnosť.")) {
            goalPart.push("bude slúžiť ako vizitka vášho podniku");
        }
        if (primaryGoals.includes("Chcem predávať produkty/služby priamo cez web (E-shop).")) {
            goalPart.push("bude plnohodnotným e-shopom");
        }
        if (primaryGoals.includes("Potrebujem platformu pre blog/obsah.")) {
            goalPart.push("bude ideálnou platformou pre váš blog a obsah");
        }

        if (goalPart.length > 0) {
            if (goalPart.length === 1) {
                sentence += `Vytvoríme web, ktorý ${goalPart[0]}.`;
            } else if (goalPart.length === 2) {
                sentence += `Vytvoríme web, ktorý ${goalPart[0]} a zároveň ${goalPart[1]}.`;
            } else { // Viac ako 2 ciele, zjednodušíme
                sentence += `Vytvoríme web, ktorý splní vaše ciele, ako je ${goalPart.slice(0, -1).join(', ')} a ${goalPart[goalPart.length - 1]}.`;
            }
        } else {
            sentence += "Vytvoríme web, ktorý bude presne zodpovedať vašim potrebám a cieľom.";
        }

        // Dizajn
        if (designExpectations) {
            let designPhrase = "";
            if (designExpectations.includes("Moderný a minimalistický.")) {
                designPhrase = "moderne a minimalisticky nadesignovaný";
            } else if (designExpectations.includes("Kreatívny a plný animácií.")) {
                designPhrase = "kreatívny a plný dynamických animácií";
            } else if (designExpectations.includes("Jednoduchý a funkčný.")) {
                designPhrase = "jednoduchý a funkčný";
            } else if (designExpectations.includes("Luxusný a prémiový.")) {
                designPhrase = "luxusný a s prémiovým vzhľadom";
            }
            if (designPhrase) {
                sentence += ` Bude ${designPhrase}.`;
            }
        }

        // Funkcionalita
        if (functionality.length > 0) {
            let funcList = [];
            if (functionality.includes("Kontaktný formulár a mapu.")) funcList.push("kontaktný formulár a mapa");
            if (functionality.includes("Galériu obrázkov/videí.")) funcList.push("galéria obrázkov/videí");
            if (functionality.includes("Rezervačný systém/Online kalendár.")) funcList.push("rezervačný systém/online kalendár");
            if (functionality.includes("Online platby.")) funcList.push("online platby");
            if (functionality.includes("Sekciu s blogom/novinkami.")) funcList.push("sekcia s blogom/novinkami");

            if (funcList.length > 0) {
                if (funcList.length === 1) {
                    sentence += ` Určite bude zabudovaný ${funcList[0]}.`;
                } else if (funcList.length === 2) {
                    sentence += ` Určite bude zabudovaný ${funcList[0]} a ${funcList[1]}.`;
                } else {
                    sentence += ` Určite bude zabudovaný ${funcList.slice(0, -1).join(', ')} a ${funcList[funcList.length - 1]}.`;
                }
                sentence += ` a oveľa viac funkcií.`;
            }
        }

        // Aktualizácie
        if (updateFrequency) {
            if (updateFrequency.includes("Áno, plánujem aktívny blog/novinky.")) {
                sentence += ` Pridáme možnosť stránku pravidelne aktualizovať a pridávať nový obsah.`;
            } else if (updateFrequency.includes("Len občas, keď to bude potrebné.")) {
                sentence += ` Pridáme možnosť stránku aktualizovať, keď to bude potrebné.`;
            } else if (updateFrequency.includes("Nie, stačí jednorazové vytvorenie.")) {
                sentence += ` Vytvoríme ju s ohľadom na jednorazové vytvorenie.`;
            }
        }

        // Rozpočet
        if (budget) {
            sentence += ` A vyhovieme aj vášmu finančnému rozpočtu v rozsahu ${budget.split('(')[0].trim()}.`;
        }

        return sentence;
    };


    const showResults = () => {
        console.log("showResults called!"); // Log pre diagnostiku

        // --- Dynamická úvodná veta ---
        const dynamicIntroSentence = generateDynamicIntroSentence(userAnswers);
        // --- Koniec dynamickej úvodnej vety ---

        let resultsHtml = `
            <div class="quiz-results-card is-visible">
                <h3>Ďakujeme za vyplnenie kvízu!</h3>
                <p>${dynamicIntroSentence}</p>
                <p>Tu je krátke zhrnutie vašich preferencií:</p>
                <ul>
        `;

        quizQuestions.forEach((q, index) => {
            const answer = userAnswers[`quiz-q${index}`];
            if (answer) {
                resultsHtml += `<li><strong>${q.question}</strong>: ${Array.isArray(answer) ? answer.join(', ') : answer}</li>`;
            }
        });

        resultsHtml += `</ul>`;

        // --- Logika pre dynamické CTA ---
        let dynamicCtaSection = '<div class="cta-suggestions">';
        // The previous logic for generating dynamic CTA based on goals and budget
        // is now commented out to prevent any dynamic CTA from appearing.
        /*
        const primaryGoals = userAnswers['quiz-q0'] || []; // Otázka 1 (index 0) - Prečo webstránka?
        const budget = userAnswers['quiz-q3']; // Otázka 4 (index 3) - Rozpočet

        // Priority for E-shop
        if (primaryGoals.includes('Chcem predávať produkty/služby priamo cez web (E-shop).')) {
            dynamicCtaSection += `
                <p>Vidíme, že máte záujem o predaj online!</p>
                <a href="#eshop-solutions" class="btn btn-primary">Prezrite si naše E-shop riešenia</a>
            `;
        } else if (primaryGoals.includes('Chcem získať nových zákazníkov online.')) {
            dynamicCtaSection += `
                <p>Prajete si osloviť nových zákazníkov?</p>
                <a href="#marketing-seo" class="btn btn-primary">Zistite, ako vám pomôžeme s marketingom</a>
            `;
        } else if (primaryGoals.includes('Chcem posilniť svoju značku a dôveryhodnosť.')) {
            dynamicCtaSection += `
                <p>Radi vám pomôžeme posilniť vašu značku!</p>
                <a href="#portfolio" class="btn btn-primary">Pozrite si naše portfólio</a>
            `;
        } else if (primaryGoals.includes('Potrebujem platformu pre blog/obsah.')) {
            dynamicCtaSection += `
                <p>Potrebujete platformu pre váš obsah?</p>
                <a href="#cms-solutions" class="btn btn-primary">Objavte naše CMS riešenia</a>
            `;
        }
        
        // If no specific CTA from goals, use budget
        if (dynamicCtaSection === '<div class="cta-suggestions">' && budget) {
            if (budget.includes('Do 300 EUR')) {
                dynamicCtaSection += `
                    <p>Hľadáte ekonomické riešenie?</p>
                    <a href="#basic-packages" class="btn btn-primary">Preskúmajte naše základné balíčky</a>
                `;
            } else if (budget.includes('Viac ako 1500 EUR')) {
                dynamicCtaSection += `
                    <p>Máte rozsiahly projekt?</p>
                    <a href="#custom-development" class="btn btn-primary">Pozrite si naše riešenia na mieru</a>
                `;
            }
        }
        */

        dynamicCtaSection += `</div>`; // Close the div for CTA

        resultsHtml += `
            ${dynamicCtaSection}
            <p>Pre detailnú a nezáväznú konzultáciu, ktorá presne zodpovie vaše potreby, nás prosím kontaktujte!</p>
            <a href="#contact" class="btn btn-primary" style="margin-bottom: 10px;">Kontaktujte Nás</a>
            <button class="btn btn-secondary" id="restart-quiz-btn">Opakovať kvíz</button>
            </div>
        `;

        const currentCard = quizContainer.querySelector('.quiz-question-card, .quiz-intro-card');
        if (currentCard) {
            currentCard.classList.remove('is-visible');
            setTimeout(() => {
                currentCard.remove();
                quizContainer.innerHTML = resultsHtml;
                setTimeout(() => {
                    const card = quizContainer.querySelector('.quiz-results-card');
                    if (card) card.classList.add('is-visible');
                }, 50);
                document.getElementById('restart-quiz-btn').addEventListener('click', () => {
                    currentQuestionIndex = 0;
                    userAnswers = {};
                    quizContainer.innerHTML = ''; // Clear results
                    quizContainer.appendChild(quizIntroCard); // Return intro card
                    quizIntroCard.classList.add('is-visible');
                });
            }, 300);
        }
    };

    startQuizBtn.addEventListener('click', () => {
        quizIntroCard.classList.remove('is-visible');
        setTimeout(() => {
            quizIntroCard.style.display = 'none'; // Hide intro card
            renderQuestion();
        }, 300); // Match fade-out time
    });
});
