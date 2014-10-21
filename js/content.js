/* Inform the backgrund page that 
 * this tab should have a page-action */

chrome.runtime.sendMessage({
    from:    'content',
    subject: 'showPageAction'
});

/* Listen for message from the popup */
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    /* First, validate the message's structure */
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        /* Collect the necessary data 
         * (For your specific requirements `document.querySelectorAll(...)`
         *  should be equivalent to jquery's `$(...)`) */
        
        var severe = msg.severe === "true" ? true : false;
        var moderate = msg.moderate === "true" ? true : false;
        var suggestion = msg.suggestion === "true" ? true : false;

        var suite = new TestSuite(severe, moderate, suggestion), res = [];

        suite.tests = [];

        if (msg.preset1 === "true") {
            suite.addTests(["aAdjacentWithSameResourceShouldBeCombined","aImgAltNotRepetative","aLinkTextDoesNotBeginWithRedundantWord","aLinksDontOpenNewWindow","aLinksToMultiMediaRequireTranscript","aLinksToSoundFilesNeedTranscripts","aMustContainText","aSuspiciousLinkText","aTitleDescribesDestination","appletContainsTextEquivalent","appletContainsTextEquivalentInAlt","appletTextEquivalentsGetUpdated","appletUIMustBeAccessible","appletsDoNotFlicker","areaAltIdentifiesDestination","areaHasAltValue","areaLinksToSoundFile","blinkIsNotUsed","blockquoteNotUsedForIndentation","blockquoteUseForQuotations","checkboxHasLabel","cssDocumentMakesSenseStyleTurnedOff","cssTextHasContrast","documentAbbrIsUsed","documentAcronymsHaveElement","documentContentReadableWithoutStylesheets","documentHasTitleElement","documentIDsMustBeUnique","documentIsWrittenClearly","documentLangIsISO639Standard","documentMetaNotUsedWithTimeout","documentReadingDirection","documentTitleDescribesDocument","documentTitleIsNotPlaceholder","documentTitleNotEmpty","documentValidatesToDocType","documentVisualListsAreMarkedUp","documentWordsNotInLanguageAreMarked","embedHasAssociatedNoEmbed","embedProvidesMechanismToReturnToParent","emoticonsExcessiveUse","emoticonsMissingAbbr","fileHasLabel","formWithRequiredLabel",/*"frameTitlesDescribeFunction","frameTitlesNotEmpty","frameTitlesNotPlaceholder","framesHaveATitle"*/"headerH1","headerH1Format","headerH2","headerH2Format","headerH3","headerH3Format","headerH4","headerH4Format","headerH5","headerH5Format","headerH6Format","headersHaveText","headersUseToMarkSections","imgAltEmptyForDecorativeImages","imgAltIsDifferent","imgAltIsSameInText","imgAltIsTooLong","imgAltNotEmptyInAnchor","imgAltNotPlaceHolder","imgGifNoFlicker","imgHasAlt","imgHasLongDesc","imgNonDecorativeHasAlt","imgNotReferredToByColorAlone","inputCheckboxRequiresFieldset","inputImageAltIdentifiesPurpose","inputImageAltIsNotFileName","inputImageAltIsNotPlaceholder","inputImageAltIsShort","inputImageAltNotRedundant","inputImageHasAlt","inputImageNotDecorative","inputTextHasLabel","labelMustBeUnique","labelMustNotBeEmpty","legendDescribesListOfChoices","legendTextNotEmpty","legendTextNotPlaceholder","listNotUsedForFormatting","objectDoesNotFlicker","objectMustContainText","objectMustHaveTitle","pNotUsedAsHeader","paragraphIsWrittenClearly","passwordHasLabel","preShouldNotBeUsedForTabularLayout","radioHasLabel","radioMarkedWithFieldgroupAndLegend","scriptOnclickRequiresOnKeypress","scriptOndblclickRequiresOnKeypress","scriptOnmousedownRequiresOnKeypress","scriptOnmousemove","scriptOnmouseoutHasOnmouseblur","scriptOnmouseoverHasOnfocus","scriptOnmouseupHasOnkeyup","scriptsDoNotFlicker","selectHasAssociatedLabel","selectJumpMenu","selectWithOptionsHasOptgroup","siteMap","skipToContentLinkProvided","svgContainsTitle","tabIndexFollowsLogicalOrder","tableCaptionIdentifiesTable","tableComplexHasSummary","tableDataShouldHaveTh","tableLayoutDataShouldNotHaveTh","tableLayoutHasNoCaption","tableLayoutHasNoSummary",/*"tableNotUsedForLayout",*/"tableUsesCaption","tableUsesScopeForRow","tableWithBothHeadersUseScope","tabularDataIsInTable","textareaHasAssociatedLabel","videoProvidesCaptions"/*,"videosEmbeddedOrLinkedNeedCaptions"*/]);
            console.log(suite.tests);
        }
        if (msg.preset2 === "true") {
            suite.addTests(["aLinksToMultiMediaRequireTranscript","aLinksToSoundFilesNeedTranscripts","appletContainsTextEquivalent","appletContainsTextEquivalentInAlt","appletTextEquivalentsGetUpdated","appletUIMustBeAccessible","appletsDoNotFlicker","appletsDoneUseColorAlone","checkboxHasLabel","documentContentReadableWithoutStylesheets","fileHasLabel","imgAltIsDifferent","imgAltIsSameInText","imgAltIsTooLong","imgAltNotEmptyInAnchor","imgAltNotPlaceHolder","imgGifNoFlicker","imgHasAlt","imgMapAreasHaveDuplicateLink","imgNonDecorativeHasAlt","imgNotReferredToByColorAlone","imgWithMapHasUseMap","inputDoesNotUseColorAlone","inputImageAltIsNotFileName","inputImageAltIsNotPlaceholder","inputImageAltIsShort","inputImageHasAlt","objectDoesNotFlicker","objectDoesNotUseColorAlone","objectTextUpdatesWhenObjectChanges","passwordHasLabel","radioHasLabel","scriptInBodyMustHaveNoscript","scriptOnclickRequiresOnKeypress","scriptOndblclickRequiresOnKeypress","scriptOnmousedownRequiresOnKeypress","scriptOnmousemove","scriptOnmouseoutHasOnmouseblur","scriptOnmouseoverHasOnfocus","scriptOnmouseupHasOnkeyup","scriptUIMustBeAccessible","scriptsDoNotFlicker","scriptsDoNotUseColorAlone","skipToContentLinkProvided","tableDataShouldHaveTh","tableWithBothHeadersUseScope","videoProvidesCaptions"]);
            console.log(suite.tests);
        }

        suite.setGlobalOptions();

        suite.run();
        // result = extensionRunQuail(suite, ["imgHasAlt", 'doctypeProvided']);
        for (r in suite.results) {
            res.push(suite.results[r]);
        }

        console.log("----------");
        console.log(res);
        var testStr = "Meep";
        var domInfo = {
            total:   "Weeeee!",
            quailRes: JSON.stringify(res),
        };

        /* Directly respond to the sender (popup), 
         * through the specified callback */
        response(domInfo);
    }
});