# Training Plan Manager - Kubernetes Starter

Scaffold projektu pod aplikacje "Aplikacja do zarzadzania planem treningowym":
- backend: Python + FastAPI + SQLAlchemy
- baza danych: PostgreSQL
- frontend: Next.js (App Router, TypeScript)
- deployment: Kubernetes (namespace + ingress + service + deployment + PVC)

## Struktura katalogow

```text
.
|-- backend
|   |-- app
|   |   |-- api/training_plans.py
|   |   |-- crud.py
|   |   |-- database.py
|   |   |-- main.py
|   |   |-- models.py
|   |   `-- schemas.py
|   |-- Dockerfile
|   `-- requirements.txt
|-- frontend
|   |-- app
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- Dockerfile
|   `-- package.json
`-- k8s
    |-- backend-configmap.yaml
    |-- backend-deployment.yaml
    |-- backend-service.yaml
    |-- frontend-configmap.yaml
    |-- frontend-deployment.yaml
    |-- frontend-service.yaml
    |-- ingress.yaml
    |-- kustomization.yaml
    |-- namespace.yaml
    |-- postgres-deployment.yaml
    |-- postgres-pvc.yaml
    |-- postgres-secret.yaml
    `-- postgres-service.yaml
```

## 1) Wymagania

- Docker
- Kubernetes (np. minikube albo kind)
- kubectl
- Ingress Controller (np. NGINX Ingress)

## 2) Build obrazow

### Minikube

```bash
eval "$(minikube -p minikube docker-env)"
docker build -t training-plan-backend:0.1.0 ./backend
docker build -t training-plan-frontend:0.1.0 ./frontend
```

### Kind

```bash
docker build -t training-plan-backend:0.1.0 ./backend
docker build -t training-plan-frontend:0.1.0 ./frontend
kind load docker-image training-plan-backend:0.1.0
kind load docker-image training-plan-frontend:0.1.0
```

## 3) Deploy na Kubernetes

```bash
kubectl apply -k k8s
kubectl get pods -n training-app
kubectl get svc -n training-app
kubectl get ingress -n training-app
```

## 4) Dostep do aplikacji

Ingress host skonfigurowany jest na:

```text
training.localtest.me
```

To domena typu wildcard, ktora mapuje sie na localhost. Jesli masz dzialajacy ingress lokalnie,
powinienes miec dostep pod URL:

```text
http://training.localtest.me
```

Backend API:
- health: `GET /health`
- treningi: `GET /api/plans`, `POST /api/plans`, `GET /api/plans/{id}`, `DELETE /api/plans/{id}`

## 5) Dane dostepowe do PostgreSQL

Aktualnie wpisane sa wartosci developerskie w `k8s/postgres-secret.yaml`:
- `POSTGRES_DB=training_db`
- `POSTGRES_USER=training_user`
- `POSTGRES_PASSWORD=training_password`

Przed wdrozeniem na srodowiska inne niz lokalne zmien te wartosci.
# miniature-fortnight
