from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt

users_db = [
    {"name": "admin", "email": "admin@gmail.com", "password": "admin"}
]

class User_model(BaseModel):
    name: str
    email: str
    password: str

class User_controller:
    @staticmethod
    def authenticate_user(user: User_model):
        for db_user in users_db:
            if (user.name == db_user["name"] or user.email == db_user["email"]) and user.password == db_user["password"]:
                return db_user
        return None

app = FastAPI()

JWT_SECRET_KEY = "tzE5drUmmncjZCNzS3-KCf8o-P76hMRIDtBd9Gu3oVQ"
JWT_HASH = "HS256"
JWT_EXPIRATION_TIME = 60 * 24 * 30 

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_jwt_token(data: dict) -> str:
    return jwt.encode(data, JWT_SECRET_KEY, algorithm=JWT_HASH)

@app.post("/login")
def login(user: User_model):
    db_user = User_controller.authenticate_user(user)
    if db_user:
        jwt_token = create_jwt_token({"sub": db_user["email"], "name": db_user["name"], "email": db_user["email"]})
        return {"status": True, "access_token": jwt_token, "token_type": "bearer", "user": db_user}
    raise HTTPException(status_code=401, detail="Credenciais inválidas")

class CalculationInput(BaseModel):
    firstNumber: float
    secondNumber: float
    operation: str

@app.post("/calculadora")
async def calcular(input_data: CalculationInput, token: str = Depends(oauth2_scheme)):
   
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_HASH])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

    result = None
    if input_data.operation == "soma":
        result = input_data.firstNumber + input_data.secondNumber
    elif input_data.operation == "subtracao":
        result = input_data.firstNumber - input_data.secondNumber
    elif input_data.operation == "multiplicacao":
        result = input_data.firstNumber * input_data.secondNumber
    elif input_data.operation == "divide":
        if input_data.secondNumber == 0:
            raise HTTPException(status_code=400, detail="Divisão por zero não é permitida")
        result = input_data.firstNumber / input_data.secondNumber
    else:
        raise HTTPException(status_code=400, detail="Operação inválida")

    return {"result": result}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
