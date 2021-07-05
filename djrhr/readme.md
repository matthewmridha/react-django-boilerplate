React django boiler plate with hot reload and authentication.

auth - JWT 

terminal A >
ROOT/venv/Scripts/activate.ps1
cd djrhr
pip install -r requirements.txt
python manage.py migrate
pyhton manage.py runserver

teminal B >
ROOT:
npm install
npm run start:dev
