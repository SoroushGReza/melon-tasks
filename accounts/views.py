from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Account

class AccountList(APIView):
    def get(self, request):
        accounts = Account.objects.all()
        return Response(accounts)