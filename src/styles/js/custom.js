import $, { } from 'jquery';

export const loadJquery = () => {
    // setTimeout(() => {
    //     $(".avh_card_user_info").responsiveEqualHeightGrid();
    // }, 3010);
    //     const script = document.createElement("script");
    //     script.innerHTML = "jQuery(function($) { \n" +
    //         // console.log("hello world")
    //         `${$(this).responsiveEqualHeightGrid()} ` +
    //         "})"
    //     // script.async = true;
    //     document.body.appendChild(script);

    // $(document).ready(function () {
    // Select and loop the container element of the elements you want to equalise
    $('.row_H_D').each(function () {
        // Cache the highest
        var highestBox = 0;

        // Select and loop the elements you want to equalise
        $('.card_heightEqual', this).each(function () {

            // If this box is higher than the cached highest then store it
            if ($(this).height() > highestBox) {
                highestBox = $(this).height();
            }

        });

        // Set the height of all those children to whichever was highest
        // $('.card_heightEqual', this).height(highestBox);
        $('.card_heightEqual', this).css('min-height', highestBox);

    });
    // });
}


export const updateHeight = () => {
    $('.row_H_D').each(function () {

        // Cache the highest
        var highestBox = 0;

        // Select and loop the elements you want to equalise
        $('.card_heightEqual', this).each(function () {
            highestBox = $(this).height();
        });

        // Set the height of all those children to whichever was highest
        $('.card_heightEqual', this).height(highestBox + 90);

    });

    // $('.card_heightEqual').height(475);
}
