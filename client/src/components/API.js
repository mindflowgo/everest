// simple wrapper around fetch to give session & do the JSON after 
function get( url ){
    return fetch( url, 
        { headers: { 'Session': localStorage.session } })
        .then( result=>result.json() );
}

function post( url, userData ){
    return fetch( url, 
        {   method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Session': localStorage.session
            },
            body: JSON.stringify(userData)
        }).then( result=>result.json());
}

export default {
    get,
    post
};