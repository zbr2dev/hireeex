import { createSelector } from "reselect";

export const selectProjects = state => state.projects;

export const selectProjectsItems = createSelector(
    [selectProjects],
    projects => projects.projects,
  );

  export const selectProjectsIsLoading = createSelector(
    [selectProjects],
    projects => projects.isLoading
  );

  export const selectIsDeleted = createSelector(
    [selectProjects],
    projects => projects.isDeleted
  );
  export const selectIsDeleting = createSelector(
    [selectProjects],
    projects => projects.isDeleting
  );