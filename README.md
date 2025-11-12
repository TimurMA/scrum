Для запуска проекта необходима java 21 версии - https://www.oracle.com/europe/java/technologies/downloads/#java21

1. Клонирование репозитория
```
git clone https://github.com/TimurMA/scrum.git
```
2. Перейти в папку с проектом
```
cd scrum
```
3. Запуск сайта для Windows
```powershell
.\gradlew clean build bootRun -x test
```
Запуск сайта для Linux/MacOS
```bash
./gradlew clean build bootRun -x test

```
