
documentationArray = [
    {url : "/api/user",httpMethod : "GET",needAuthorization : false},
    {url : "/api/user/",httpMethod : "POST",needAuthorization : true},
    {url : "/api/user/:id",httpMethod : "GET",needAuthorization : true},
    {url : "/api/user/:id",httpMethod : "PUT",needAuthorization : true},
    {url : "/api/user/:id",httpMethod : "DELETE",needAuthorization : true},
    {url : "/api/stories",httpMethod : "GET",needAuthorization : false},
    {url : "/api/user/:id/stories",httpMethod : "GET",needAuthorization : true},
    {url : "/api/stories/id",httpMethod : "PUT",needAuthorization : true},
    {url : "/api/stories",httpMethod : "DELETE",needAuthorization : true},
    {url : "/api/login",httpMethod : "POST",needAuthorization : false},
]
module.exports = documentationArray;