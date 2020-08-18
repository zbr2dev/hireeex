import { createSelector } from "reselect";

export const selectFilters = state => state.filters;

export const selectFiltersCompaniesList = createSelector(
    [selectFilters],
    filters => filters.companiesList
  );


  export const selectFiltersLocationsList = createSelector(
    [selectFilters],
    filters => filters.locationsList
  );

  export const selectFiltersSkillsList = createSelector(
    [selectFilters],
    filters => filters.skillsList
  );

  export const selectFiltersTitlesList = createSelector(
    [selectFilters],
    filters => filters.titlesList
  );