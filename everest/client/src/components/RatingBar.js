import React from "react";

function RatingBar( props ){
    let starsHtml = '';
    for( let starCnt=1; starCnt<=5; starCnt++ ){
        starsHtml += ( props.rating >= starCnt 
            ? '<i class="fas fa-star text-warning"></i>'
            : '<i class="far fa-star"></i>' );
    }
    return (
        <div dangerouslySetInnerHTML={{ __html: starsHtml }}></div>
    )
}

export default RatingBar;