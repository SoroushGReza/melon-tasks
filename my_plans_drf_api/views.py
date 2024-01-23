from rest_framework.decorators import api_view
from rest_framework.response import Response
from .settings import (
    JWT_AUTH_COOKIE, JWT_AUTH_REFRESH_COOKIE, JWT_AUTH_SAMESITE,
    JWT_AUTH_SECURE,
)


# Define a view for the root route of the API
@api_view()
def root_route(request):
    # Welcome message when the root route is accessed
    return Response({
        "message": "Welcome to My Plans API!"
    })


# Define a view for the logout functionality
@api_view(['POST'])
def logout_route(request):
    # Create an empty Response object
    response = Response()
    # Set cookie in response for JWT_AUTH_COOKIE with
    # empty value and settings to make it expire immediately
    response.set_cookie(
        key=JWT_AUTH_COOKIE,
        value='',
        httponly=True,
        expires='Thu, 01 Jan 1970 00:00:00 GMT',  # Old expiry to delete cookie
        max_age=0,  # The cookie will expire immediately
        samesite=JWT_AUTH_SAMESITE,
        secure=JWT_AUTH_SECURE,
    )
    # Set another cookie for JWT_AUTH_REFRESH_COOKIE
    response.set_cookie(
        key=JWT_AUTH_REFRESH_COOKIE,
        value='',
        httponly=True,
        expires='Thu, 01 Jan 1970 00:00:00 GMT',
        max_age=0,
        samesite=JWT_AUTH_SAMESITE,
        secure=JWT_AUTH_SECURE,
    )
    # Return the response which now has the cookies set to log the user out
    return response
