import { createSelector } from "reselect";

export const selectCandidates = state => state.candidates;

export const selectCandidatesStage = createSelector(
    [selectCandidates],
    candidates => candidates.stageType
  );


  export const selectCandidatesList = createSelector(
    [selectCandidates, selectCandidatesStage],
    candidates => candidates.candidates
  );

  export const selectCandidatesIsLoading = createSelector(
    [selectCandidates],
    candidates => candidates.isLoadingCandidates
  );