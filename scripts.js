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
    var arrowDown = '&#8711;';
    var arrowUp = '&#8710';

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

    /**
     * Returns the order of sorting
     *      1: ASC (a -> z)
     *      2: DESC (z -> a)
     * @param {jQuery Object} $el
     * @returns {Integer}
     */
    function getSortingOrder($el) {
        if ($el.hasClass('arrow-up')) {
            $el
                .removeClass('arrow-up')
                .addClass('arrow-down')
                .html(arrowDown);
            return 1;
        }

        $el
            .removeClass('arrow-down')
            .addClass('arrow-up')
            .html(arrowUp);
        return 2;
    }

    /**
     * Checks if element has class `.data-is-number`
     * 
     * @param {jQuery Object} $el
     * @returns {Integer}
     */
    function isDataNumber($el) {
        if ($el.hasClass('data-is-number')) {
            return true;
        }
        
        return false;
    }

    /**
     * Returns object of td values of column to sort
     * object: {
     *      index:
     *      value:
     * }
     * 
     * @param {Integer} columnIndex
     * @param {Boolean} isNumber
     * @returns {array}
     */
    function getTdValues(columnIndex, isNumber) {
        var values = [];

        $('.' + tableTrs)
            .find('td:eq(' + columnIndex + ')')
            .each(function(index) {
                if (isNumber) {
                  values.push({'index': index, 'value': $(this).text().slice(0, -1).trim()});
                } else {
                 values.push({'index': index, 'value': $(this).text()}); 
                }
              });
        return values;
    }

    /**
     * Sorts the table
     * 
     * @param {Object} values 
     * @param {Boolean} isNumber
     * @returns {Object} 
     */
    function sortValues(values, isNumber) {
        var len = values.length;
        var temp;
        var i, j;

        for (i = len - 1 ; i >= 0; i--) {
            for(j = 1; j <= i; j++) {
                if(isNumber) {
                    if (parseFloat(values[j-1].value) > parseFloat(values[j].value)) {
                        temp = values[j-1];
                        values[j-1] = values[j];
                        values[j] = temp;
                        // criar boolean aqui, condicoes diferentes accoes iguais, so uma vez entao
                    }
                } else {
                    if (values[j-1].value > values[j].value) {
                        temp = values[j-1];
                        values[j-1] = values[j];
                        values[j] = temp;
                    }
                }
            }
        }

        return values;
        /*var len = values.length;
        var temp;
        // for (i = len - 1 ; numberComparison(-1 , i) ; i--)
        for (i = len - 1 ; i >= 0; i--) {
          // for(j = 1; numberComparison(j , (i + 1)) ; j++) {
          for(j = 1; j <= i; j++) {
            if(isNumber) {
              // if ( numberComparison( parseFloat(values[j].value), parseFloat(values[j-1].value) ) )
              if (parseFloat(values[j-1].value) > parseFloat(values[j].value)) {
                temp = values[j-1];
                values[j-1] = values[j];
                values[j] = temp;
              }
            } else {
              if (numberComparison(values[j].value, values[j-1].value))
             // if (values[j-1].value > values[j].value) {
                temp = values[j-1];
                values[j-1] = values[j];
                values[j] = temp;
              } 
            }
          }*/
    }

    /**
     * Updates the table with the proper order
     * 
     * @param {Object} values
     * @param {Integer} sortingOrder 
     */
    function updateTable(values, sortingOrder) {
        var trValues = $('.' + tableTrs);
        var tableBody = $('.' + tableHook + ' tbody');
        tableBody.empty();
        
        if (sortingOrder === 2) {
            for (i = (values.length - 1) ; numberComparison(-1, i) ; i--) {
                tableBody.append(trValues[values[i].index]);
            }
        } else {
            for (i = 0 ; numberComparison(i, values.length) ; i++) {
                tableBody.append(trValues[values[i].index]);
            }
        }
    }

    /**
     * Sorting table function
     */
    function tableSorting() {
        var sortingOrder = 1;
        var columnIndex;
        var isNumber;
        var tdValues;

        columnIndex = getColumnIndex($(this));
        if (numberComparison(columnIndex, -1) === 1) {
            return;
        }

        sortingOrder = getSortingOrder($(this));        
        isNumber = isDataNumber($(this));
        tdValues = getTdValues(columnIndex, isNumber);
        console.log(tdValues);
        tdValues = sortValues(tdValues, isNumber);
        console.log(tdValues);
        updateTable(tdValues, sortingOrder);
    }

    // add sorting event listener 
    $orderingHook.on('click', tableSorting);
    // add show key word filters listeners
    $showKeyWordFilterTag.on('click', toggleKeyWordFilters);
    // add keystroke event listener
    $keyWordFilter.on('keyup', tableKeyWordFiltering);
})(window);