// Show/Hide main menu(left sidebar) by clicking on hamburger menu
export function hamburgerClick(){
    var mainMenu= document.getElementById('main-menu');
    Object.assign(mainMenu.style,{position:"absolute",top:"41px"});
    var navIcon = document.getElementById('nav-icon3');
    if (navIcon.classList.contains('open')) {
        navIcon.classList.remove("open");
        Object.assign(mainMenu.style,{left:"-300px"});
    } else {
        navIcon.classList.add("open");
        Object.assign(mainMenu.style,{left:"0px"});
    }
}


// For Search row at the top of page
export function addListenerOnResizeSearch() {
    searchPositioning();
    window.addEventListener("resize", searchPositioning);
}
// For Search row at the top of page
export function removeListenerOnResizeSearch() {
    window.removeEventListener("resize", searchPositioning);
}
/*Positioning of search menu in mobile version of website.
If top menu has height 41px then search menu has position 45px , otherwise - search menu has position 79px.
Function executes on all pages with top row.*/
export function searchPositioning() {
    var topRowSearch = document.getElementById("top-row-search");
    var topRow = document.getElementById('top-row');
    var topRowHeight = window.getComputedStyle(topRow, null).getPropertyValue("height");//check humburger display value
    if (topRowHeight == "41px") {
        Object.assign(topRowSearch.style,{top:"45px",right:"7px"});
    }
    else {
        Object.assign(topRowSearch.style,{top:"79px",right:"6px"});
    }
}


// For Projects component
export function addListenerOnResizeProj() {
    projectsHeight();//count height of projects wrapper for Projects page
    projectsWidth();//count width of projects wrapper for Projects page
    window.addEventListener("resize", projectsHeight);
    window.addEventListener("resize", projectsWidth);

}
// For Projects component
export function removeListenerOnResizeProj(){
    window.removeEventListener("resize", projectsHeight);
    window.removeEventListener("resize", projectsWidth);

}
/*Count height of block with all projects(projects-main-content) on Projects page.
Counting happens on window resize and on page load*/
export function projectsHeight() {
    // height of projects-main-content = height of window - (height of top row + height of create proj row )
    setTimeout(() => {
    var topRow = document.getElementById('top-row');
    let createProjRow = document.getElementById('create-proj-row');
    var projectsWrapper = document.getElementById("projects-main-content");
    
    var winHeight = window.innerHeight;//height of window
    var topRowHeight = parseInt(window.getComputedStyle(topRow, null).getPropertyValue("height"));//height of top row 
        let createProjHeight = createProjRow.offsetHeight;//height of create proj row
        var projectsWrapperHeight = winHeight - (topRowHeight  + createProjHeight );// height of projects-main-content
        Object.assign(projectsWrapper.style,{height:projectsWrapperHeight+"px"});//apply height of projects-main-content
        // console.log('createProjHeight='+createProjHeight);
        // console.log('topRowHeight='+topRowHeight);
        // console.log('winHeight='+winHeight);
        // console.log('projectsWrapperHeight='+projectsWrapperHeight);
    }, 100);
}
/*For Projects Component. Count width of Projects main block*/ 
export function projectsWidth() {
    var w = window.innerWidth;
    var mainTag = document.getElementById("main-tag"); //tag <main> wich is one for all pages.

    // console.log("w="+w);
    if ((w<1263) && (w>850)) {
        Object.assign(mainTag.style,{width:'calc(100% - 83px)'});
    } else {
        Object.assign(mainTag.style,{width:'100%'});
    }
}


//For Candidates component. (Page with Candidate Categories:Contacted,Uncontacted,..)
export function addListenerOnResizeCandidCat() {
    candidatesWithCategHeight();//count height of candidates block wrapper for page with candidates categories(Contacted,Uncontacted...,)
    window.addEventListener("resize", candidatesWithCategHeight);
}
//For Candidates component. (Page with Candidate Categories:Contacted,Uncontacted,..)
export function removeListenerOnResizeCandidCat(){
    window.removeEventListener("resize", candidatesWithCategHeight);
}

/*count height of wrapper with Candidates (candidates-content-wrapper). On page with candidates categories:Contacted,Uncontacted..*/ 
export function candidatesWithCategHeight() {
    var topRow = document.getElementById('top-row');
    var candidateCategRow = document.getElementById('candidate-categories-wrapper');
    var candidateFiltersRow = document.getElementById("candidate-sorting");
    var candidatesWithCategWrapper = document.getElementById("candidates-with-categories-wrapper");

    var winHeight = window.innerHeight;//height of window
    var topRowHeight = parseInt(window.getComputedStyle(topRow, null).getPropertyValue("height"));//height of top row 
    var candidateCategHeight = parseInt(window.getComputedStyle(candidateCategRow, null).getPropertyValue("height"));//height candidate categories row
    var candidateFiltersHeight = parseInt(window.getComputedStyle(candidateFiltersRow, null).getPropertyValue("height"));// height of candidates filter row

   
    /*count heigth of candidates-content-wrapper. If this is mobile version(< 1024 px) this block shoul take all the posiible window height part(no white space under this block). 
    Candidates-content-wrapper height = height of window - (height of top row + candidate categories row - candidates filter row ).
    We can check if this is mobile version(< 1024 px) by cheking candidate-categories-wrapper css (flex-wrap). It becomes nowrap if
    scree is smaller then 1024px*/
    var candidateCategoriesWrapper = document.getElementById('candidate-categories-wrapper');
    var candidateCategoriesWrapperFlexWrap = window.getComputedStyle(candidateCategoriesWrapper, null).getPropertyValue("flex-wrap");
    if (candidateCategoriesWrapperFlexWrap=='nowrap') {
        var candidatesWithCategWrapperHeight= winHeight - (topRowHeight  + candidateCategHeight + candidateFiltersHeight);//count heigth of candidates-with-categories-wrapper
        Object.assign(candidatesWithCategWrapper.style,{maxHeight:candidatesWithCategWrapperHeight+"px"});//apply height of candidates-with-categories-wrapper
    }
    /*else: candidates-content-wrapper height = height of window - (height of top row + candidate categories row - candidates filter row + 50px).
    It means that wrapper with candidates will take not all the posiible park of window height,but a little bit smaller*/
    else {
        var candidatesWithCategWrapperHeight= winHeight - (topRowHeight  + candidateCategHeight + candidateFiltersHeight + 50);//count heigth of candidates-with-categories-wrapper
        Object.assign(candidatesWithCategWrapper.style,{maxHeight:candidatesWithCategWrapperHeight+"px"});//apply height of candidates-with-categories-wrappert
    }

    var mainTag = document.getElementById("main-tag"); //tag <main> wich is one for all pages.
    var mainMenu = document.getElementById('main-menu');//left blue menu on candidates with categories page
    var mainMenuPosition = window.getComputedStyle(mainMenu, null).getPropertyValue("position");//check position of left blue menu(static or absolute)
    var mainMenuWidth = window.getComputedStyle(mainMenu, null).getPropertyValue("width");//width of  left blue menu
    // if position of left blue menu is static-we should calc the width of main tag(100% - width of blue menu)
    if (mainMenuPosition=='static') {
        // console.log("static");
        Object.assign(mainTag.style,{width:'calc(100% - 83px)'});

    }
    // if position of left blue menu is absolute then width of main tag=100%
    else {
        Object.assign(mainTag.style,{width:'100%'});
        //console.log("absolute");
    }
}


//For SourcingCreateConfirm component. (Page with "Are we on the right track" block)
export function addListenerOnResizeSourcCandid() {
    sourcingCandidatesHeight();
    window.addEventListener("resize", sourcingCandidatesHeight);
}
//For SourcingCreateConfirm component. (Page with "Are we on the right track" block)
export function removeListenerOnResizeSourcCandid(){
    window.removeEventListener("resize", sourcingCandidatesHeight);
}
/*count height of wrapper with Sourcing Candidates. (Page with "Are we on the right track" block)*/ 
export function sourcingCandidatesHeight() {
    // height of candidates-content-wrapper = height of window - (height of top row)
    var topRow = document.getElementById('top-row');
    var candidatesWrapper = document.getElementById("candidates-content-wrapper");
    var winHeight = window.innerHeight;//height of window
    var topRowHeight = parseInt(window.getComputedStyle(topRow, null).getPropertyValue("height"));//height of top row 

    var candFixedBtns= document.getElementById('candidates-fixed-btns-row');
    var mainContentItem = document.getElementById('main-content-item-sourcing');

    var w = window.innerWidth;
    // console.log("w="+w);
    if (w<1025) {
        Object.assign(mainContentItem.style,{padding:0});
        var candidatesWrapperHeight= winHeight - (topRowHeight);
        Object.assign(candidatesWrapper.style,{height:candidatesWrapperHeight+"px"});//apply height to candidates-content-wrapper
        Object.assign(candFixedBtns.style,{bottom:0});
        var candidatesWrapperWidth = parseInt(window.getComputedStyle(candidatesWrapper, null).getPropertyValue("width"));
        Object.assign(candFixedBtns.style,{width:candidatesWrapperWidth+"px"});
    }
    else {
        Object.assign(mainContentItem.style,{padding:15+'px'});
        var candidatesWrapperHeight= winHeight - (topRowHeight + 35);
        Object.assign(candidatesWrapper.style,{height:candidatesWrapperHeight+"px"});//apply height to candidates-content-wrapper
        Object.assign(candFixedBtns.style,{bottom:19+'px'});
        var candidatesWrapperWidth = parseInt(window.getComputedStyle(candidatesWrapper, null).getPropertyValue("width"));
        Object.assign(candFixedBtns.style,{width:candidatesWrapperWidth+"px"});
    }
}


//For SourcingList component. (Page with blue and green progress lines)
export function addListenerOnResizeSourcList() {
    sourcingListHeight();
    window.addEventListener("resize", sourcingListHeight);
}
//For SourcingList component. (Page with blue and green progress lines)
export function removeListenerOnResizeSourcList(){
    window.removeEventListener("resize", sourcingListHeight);
}
/*count height of main(scrolling) block of SourcingList component. (Page with blue and green progress lines)*/ 
export function sourcingListHeight() {
    // height of sourcingList-wrapper = height of window - (height of top row + height of Ai search div )
    var topRow = document.getElementById('top-row');
    var aiSearch = document.getElementById('ai-search');
    var winHeight = window.innerHeight;//height of window
    var topRowHeight = parseInt(window.getComputedStyle(topRow, null).getPropertyValue("height"));//height of top row 
    var aiSearchHeight = parseInt(window.getComputedStyle(aiSearch, null).getPropertyValue("height"));//height of Ai search div 
    var w = window.innerWidth;
    if (w<1025) {
        var sourceListWrapperHeight= winHeight - (topRowHeight + aiSearchHeight  + 20);//count height of sourcingList-wrapper
        var sourceListWrapper= document.getElementById('search-wrapper');//assign variable to the block "search-wrapper"
        Object.assign(sourceListWrapper.style,{maxHeight:sourceListWrapperHeight+"px"});
    }
    else {
        var sourceListWrapperHeight= winHeight - (topRowHeight + aiSearchHeight  + 40);//count height of sourcingList-wrapper
        var sourceListWrapper= document.getElementById('search-wrapper');//assign variable to the block "search-wrapper"
        Object.assign(sourceListWrapper.style,{maxHeight:sourceListWrapperHeight+"px"});
    }
}


//For Settings component. 
export function addListenerOnResizeSettings() {
    settingsHeight();
    window.addEventListener("resize", settingsHeight);
}
//For Settings component.
export function removeListenerOnResizeSettings() {
    window.removeEventListener("resize", settingsHeight);
}
//For Settings component.count heignt of settings page wrapper for mobile version
export function settingsHeight() {
    var topRow = document.getElementById('top-row');
    var settingsSidebar = document.getElementById('settings-sidebar');
    var settingsTabInfo = document.getElementById('settings-tab-info');
    var winHeight = window.innerHeight;//height of window
    var topRowHeight = parseInt(window.getComputedStyle(topRow, null).getPropertyValue("height"));//height of top row 
    var settingsSidebarHeight = parseInt(window.getComputedStyle(settingsSidebar, null).getPropertyValue("height"));//height of top row 

    var w = window.innerWidth;
    // console.log("w="+w);

    //check if settings tab are at the top part of the page. This can be checked by cheking "settings-page-wrapper" display property
    var settingsPageWrapper = document.getElementById('settings-page-wrapper');
    var settingsWrapperDisplay = window.getComputedStyle(settingsPageWrapper, null).getPropertyValue("display");
    // console.log('settingsWrapperDisplay='+settingsWrapperDisplay);
    if (w<1025) {
        // console.log('winHeight='+winHeight);
        // console.log('topRowHeight='+topRowHeight);
        // console.log('settingsSidebarHeight='+settingsSidebarHeight);
        var settingsWrapperHeight= winHeight - (topRowHeight + settingsSidebarHeight); //count height of settings page wrapper

        // console.log('settingsWrapperHeight='+settingsWrapperHeight);
        if (settingsWrapperDisplay=='flex') {
            if (w<700) {
                Object.assign(settingsTabInfo.style,{margin:5+"px"});
                var settingsWrapperHeight= winHeight - (topRowHeight+30); //count height of settings page wrapper
            Object.assign(settingsTabInfo.style,{maxHeight:settingsWrapperHeight+'px'});

            }
            else {
                Object.assign(settingsTabInfo.style,{margin:0});
                var settingsWrapperHeight= winHeight - (topRowHeight); //count height of settings page wrapper
                Object.assign(settingsTabInfo.style,{maxHeight:settingsWrapperHeight+'px'});
            }
        }
        else {
            Object.assign(settingsTabInfo.style,{margin:0});
            var settingsWrapperHeight= winHeight - (topRowHeight + settingsSidebarHeight); //count height of settings page wrapper
            Object.assign(settingsTabInfo.style,{maxHeight:settingsWrapperHeight+'px'});
        }
    }  
    else {
        if (settingsWrapperDisplay=='flex') {
            Object.assign(settingsTabInfo.style,{margin:15+"px"});
            var settingsWrapperHeight= winHeight - (topRowHeight); //count height of settings page wrapper
            Object.assign(settingsTabInfo.style,{maxHeight:settingsWrapperHeight+'px'});
        }
        else {
            Object.assign(settingsTabInfo.style,{margin:0});
            var settingsWrapperHeight= winHeight - (topRowHeight + settingsSidebarHeight); //count height of settings page wrapper
            Object.assign(settingsTabInfo.style,{maxHeight:settingsWrapperHeight+'px'});
        }
    }  
}


// hide/show search input by clicking on search icon in the right part of screen(near name circle) in mobile version of website.
export function showMobSearch(){
    var topRowSearch = document.getElementById("top-row-search");
    var mobSearchCSSprop = window.getComputedStyle(topRowSearch, null).getPropertyValue("display");//check search input display value
    if (mobSearchCSSprop == "none") {
        topRowSearch.style.display = "block";
    } else {
        topRowSearch.style.display = "none";
    }
}

