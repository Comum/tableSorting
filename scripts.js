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
     * Returns char's ASCII code
     * 
     * @param {Char} char
     * @returns {Integer}
     */
    function getAsciiValue (char) {
        return char.charCodeAt(0);
    }
    
    /**
     * Gets the sum of the ASCII values of the string passed
     * 
     * @param {String} word
     * @returns {Integer}
     */
    function getWordInAscii(word) {
        var sum = 0;

        word
            .split('')
            .map(getAsciiValue)
            .forEach(function (value) {
                sum = sum + parseInt(value, 10);
            });
    
        return sum;
    }
    
    /**
     * returns:
     *	 0 if same value
     *	-1 if left word comes first
     *	 1 if right word comes first
     */

    /**
     * Returns a number that means what word comes first ('smallest')
     *      0  same value
     *      -1 left word comes first
     *      1  right word comes first
     * 
     * @param {String} _left
     * @param {String} _right
     * @returns {Integer}
     */
    function wordComparison(_left, _right) {
        var diff;
        var left = _left.toLowerCase();
        var right = _right.toLowerCase();
        var leftValue;
        var rightValue;
        var comparison;
        var index = 0;
        var equalWords = true;
        var wordIndex;
    
        // check if words are the same (they are both lower case)
        if (left === right) {
            return 0;
        }
    
        // check if word in contained inside the other
        comparison = numberComparison(left.length, right.length);
    
        if (comparison === -1) {
            wordIndex = left.indexOf(right);
            if (wordIndex !== -1) {
                if (wordIndex !== 0) {
                    // right word comes first
                    return 1;
                }   
            }
        } else if (comparison === 1) {
            wordIndex = right.indexOf(left);
            if (wordIndex !== -1) {
                if (wordIndex !== 0) {
                    // left word comes first
                    return -1;
                }
            }
        }
    
        // compare words
        // get index where words start to get different
        while(equalWords) {
            if (left[index] !== right[index]) {
                equalWords = false;
            }
    
            index++;
        }
    
        left = left.substring(0, index);
        right = right.substring(0, index);
    
        leftValue = getWordInAscii(left);
        rightValue = getWordInAscii(right);
            
        return numberComparison(leftValue, rightValue);
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
        var updateValues;
        var i, j;

        for (i = len - 1 ; numberComparison(-1 , i) ; i--) {
            for (j = 1; numberComparison(j , (i + 1)) ; j++) {
                updateValues = false;

                if(isNumber) {
                    if (numberComparison(parseFloat(values[j].value), parseFloat(values[j-1].value)) === 1) {
                        updateValues = true;
                    }
                } else {
                    if (wordComparison(values[j-1].value, values[j].value) === 1) {
                        updateValues = true;
                    }
                }

                if (updateValues) {
                    temp = values[j-1];
                    values[j-1] = values[j];
                    values[j] = temp;
                }
            }
        }

        return values;
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
        tdValues = sortValues(tdValues, isNumber);
        updateTable(tdValues, sortingOrder);
    }

    // add sorting event listener 
    $orderingHook.on('click', tableSorting);
    // add show key word filters listeners
    $showKeyWordFilterTag.on('click', toggleKeyWordFilters);
    // add keystroke event listener
    $keyWordFilter.on('keyup', tableKeyWordFiltering);
})(window);