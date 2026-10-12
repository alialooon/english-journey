# English Journey — quality audit and corrective release 11.1.0

Audit date: 2026-10-12. Scope: 100 thematic weeks (25 A1, 25 A2, 50 B1), 600 course sessions, lesson bank, knowledge checks and A2/B1 exam logic. This is a **technical and content audit**, not CEFR certification or an external expert evaluation.

## Critical findings in release 11.0.0

1. **Answer leakage through answer positions:** In the newly generated 69 A2/B1 units all **414 topic quiz questions, 345 reading/audio questions and 276 dialogue turns** put the correct choice at index 0. Together, **1,035/1,035 correct answers were option A**. This invalidated a substantial share of the learning assessment. Existing A1 and first six A2 units were not subject to this particular generator defect.
2. **Ambiguous grammar questions:** Two questions per newly generated unit asked learners to choose a sentence matching a grammar example even when multiple alternatives were grammatical. Replaced with unambiguous meaning-matching tasks, alongside the existing gap-fill and free-typed sentence exercises.
3. **Repeated content:** 69 advanced lessons reused the same extra vocabulary list and broad dialogue lead-ins; advanced reading and audio were variations of a short fixed template. Topic-specific model expressions have been added to the lexical bank, passage openings and structures diversified across four formats per CEFR group, and prompts made relevant to the situation. The original 69 distinct situations, grammar targets, and vocabulary lists remain intact.
4. **Grammar model answer leaked on a wrong entry:** After a failed recall, the UI showed the complete English answer. This made retries susceptible to copying. The updated UI directs learners to review the rule without showing the exact answer.
5. **A2/B1 graduation tests recycled regular lesson material:** The 36-question exams included only rehearsed reading/listening items from the same lesson bank. Each exam now uses 6 new reading texts and 6 new listening scripts (12 unseen comprehension questions per level) in place of the regular texts. The other sections retain representative sampled grammar/vocabulary plus 4 independent sentence-production tasks. Repeated exam attempts may still encounter the same unseen bank; future expansion is needed to make this a robust summative assessment.
6. **Audio limitation:** New A2/B1 listening is browser-generated speech (TTS). It is not authentic listening to unscripted speakers or different natural accents. It remains explicitly marked as TTS; users are referred to British Council level-appropriate authentic recording and comprehension tasks. External practice results are not tracked within English Journey. Therefore internal listening scores **do not confirm authentic CEFR listening**.

## Automated regression checks in 11.1.0

- 100 course topics, 600 six-part daily lesson sessions, preserved A1 and original six A2 blocks.
- 69 advanced units rewritten at runtime from original authored situational data; vocabulary state preserves existing item IDs.
- Every advanced topic quiz, reading question, audio question, and dialogue turn has a valid answer and three distinct options. Correct positions distributed among 0/1/2. No answer string changed inadvertently during shuffling.
- All 69 new reading texts and 69 listening scripts are unique to their scenario.
- A2 and B1 final exams contain 36 questions: 12 grammar, 12 vocabulary, 6 unseen reading, 6 unseen scripted/TTS listening; they also retain 4 free-form short sentence-production tasks.
- New files do not change the original `localStorage` key `englishJourneyTravelV1`, course ordering, completed lesson indexes, or stored exam results.
- The 11.1.0 release makes no claim of CEFR certification or teacher-level speaking/writing assessment.

## CEFR audit conclusion

| Dimension | A1 | A2 | B1 | Important limitation |
| --- | --- | --- | --- | --- |
| Planned subject coverage | 25 topic blocks | 25 topic blocks | 50 topic blocks | Topic count does not prove learning outcomes. |
| Grammar | Rules, fill-in and typed reproduction | Extended models and production | Further models and production | Exact-answer checking does not handle all valid paraphrases. |
| Vocabulary | Recall / spaced review | Thematic recall | Thematic recall | Lexical range and transfer must be tested independently. |
| Reading | Simple texts and factual questions | Everyday practical texts, new unseen texts in final | Narrative, opinions and inference in unseen final texts | Final bank is still small and will be reused on retest. |
| Listening | External publisher recordings in early lessons | Real British Council sources + self-produced synthetic scripts | Real British Council sources + self-produced synthetic scripts | Native app scores only TTS for the advanced units. |
| Interaction / speaking | Choice of replies and self-practice | Situational choices | Situational choices | No genuine spontaneous teacher-assessed conversation. |
| Exams | Internal course exam | Internal 36-question test + production | Internal 36-question test + production | No validated CEFR standard-setting or proctoring. |

**Judgement:** English Journey is a structured self-study course with improved assessment integrity. Passing it is not equivalent to passing an independent A1, A2 or B1 examination, and does not yet demonstrate the same rounded competence as a high-quality language school. For a reliable CEFR judgement, require external skills assessment, natural speech comprehension, speaking and writing feedback and calibrated, independently marked tasks.

Sources for benchmark design:
- Council of Europe CEFR descriptors: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors
- Cambridge guided learning hours (cumulative A1 90–100, A2 180–200, B1 350–400): https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours
- British Council authentic A2 listening: https://learnenglish.britishcouncil.org/free-resources/listening/a2
- British Council authentic B1 listening: https://learnenglish.britishcouncil.org/free-resources/listening/b1

## Future priorities

1. Author an expanded question bank with teacher-reviewed distractors, tests graded by skills and never-seen alternate forms.
2. Add and license authentic audio recordings aligned to each in-app question, retaining source attribution and accessibility.
3. Implement verified evaluation of spontaneous spoken interaction and extended writing via a competent examiner (human or appropriately validated scoring).
4. Review every advanced unit editorially for grammar explanations, idiomatic phrasing, CEFR target appropriateness and cross-unit progression; automated uniqueness checks are not linguistic expert review.
5. Add optional independent A2/B1 mock tests and calibrated evidence against actual proficiency benchmarks.