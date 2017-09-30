/**
 * Objective, order and filter table
 * without using chars: '<', '>' and '&' in the code 
*/
(function () {
    var $orderingHook = $('.js-order-hook');
    var $showKeyWordFilterTag = $('.js-show-key-word-filter');
    var $keyWordFilterContainer = $('.js-key-word-filter-container');
    var $keyWordFilter = $('.js-key-word-filter');
    
    var tableHook = 'js-table-hook';
    var tableTrs = tableHook + ' tbody tr';

    /**
     * returns:
     *	 0 if same value
    *	-1 if left bigger
    *	 1 if right bigger
    */
    /**
     * Compares two numbers and checks which is higher
     * Returns:
     *      0 if same value
     *      -1 if left bigger value
     *      1 if right bigger value
     * @param {Integer} left
     * @param {Integer} right
     * @returns {Integer}
     */
    function numberComparison(left, right) {
        var diff;

        if (left === right) {
            return 0;
        }

        diff = left - right;
        if (diff.toString()[0] === '-') {
            return 1;
        }

        return -1;
    }

    /**
     * Clean filters
     */
    function removeNoDisplayClass() {
        var $noDisplayElements = $('.noDisplay');
        $noDisplayElements.removeClass('noDisplay');
    }

    /**
     * get column index
     * @param {jQuery Object} $el
     */
    function getColumnIndex($el) {
        return $el.parent().index();
    }

    /**
     * Sorting table function
     */
    function tableSorting() {
        alert('sort table');
    }

    /**
     * Shows/hides the word fields to filter the table
     */
    function toggleKeyWordFilters() {
        $keyWordFilterContainer.toggle();
    }

    /**
     * When the user clicks a key, the table is filtered
     * @param {event} e 
     */
    function tableKeyWordFiltering(e) {
        var columnIndex;
        var filterWord = $(this).val().trim();
        var tdValues;

        // create ESC functionalitly
        // on ESC press clear the input of the selected field
        if (e.keyCode === 27) {
            $keyWordFilter.val('');
            removeNoDisplayClass();
            return;
        }

        // get column index
        columnIndex = getColumnIndex($(this));

        // hide relevant tr
        if (numberComparison(-1, columnIndex) === 1) {
            if (filterWord.length === 0) {
                removeNoDisplayClass();
            } else {
                tdValues = $('.' + tableTrs)
                    .find('td:eq(' + columnIndex + ')')
                    .each(function () {
                        var indexOfCharInFilterWord = $(this).text().trim().indexOf(filterWord);

                        if (indexOfCharInFilterWord === -1) {
                            $(this).parent().addClass('noDisplay');
                        }
                    });
            }
        }
    }

    // add sorting event listener 
    $orderingHook.on('click', tableSorting);
    // add show key word filters listeners
    $showKeyWordFilterTag.on('click', toggleKeyWordFilters);
    // add keystroke event listener
    $keyWordFilter.on('keyup', tableKeyWordFiltering);
})(window);