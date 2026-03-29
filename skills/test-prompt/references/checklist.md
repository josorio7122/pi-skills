# Testing Checklist

## RED Phase

- [ ] Designed test scenarios for prompt type
- [ ] Ran scenarios WITHOUT prompt
- [ ] Documented agent behavior/failures verbatim
- [ ] Identified patterns and critical failures

## GREEN Phase

- [ ] Wrote prompt addressing specific baseline failures
- [ ] Prompt is neither over-specified (blocks valid paths) nor under-specified (allows bad paths)
- [ ] Used persuasion principles if discipline-enforcing
- [ ] Ran scenarios WITH prompt
- [ ] Verified baseline failures resolved

## REFACTOR Phase

- [ ] Tested for new rationalizations/loopholes
- [ ] Added explicit counters for discipline violations
- [ ] Used meta-testing to verify clarity
- [ ] Reduced tokens without losing behavior
- [ ] Re-tested — still passes
- [ ] No regressions on previous scenarios
