# ally_bot

Este proyecto es un bot de Telegram capaz de decir el clima para una ciudad en una ubicación específica.

Consta de dos funcionalidades principales:

## /Clima

Es una función donde busca el clima según la ciudad ingresada.

## /Contar

Lleva un conteo de la cantidad de interacciones que se ha tenido con el bot.

## Requisitos

-   Clonar el repositorio

-   Crear un archivo .env con el siguiente contenido:

```
TELEGRAM_TOKEN=<TOKEN_DE_TELEGRAM>
WEATHER_KEY=<OPENWEATHER_APIKEY>
OPENAI_API_KEY=<OPENAI_APIKEY>
DEBUG=FALSE
```

-   npm install

-   Para correrlo: npm run server
