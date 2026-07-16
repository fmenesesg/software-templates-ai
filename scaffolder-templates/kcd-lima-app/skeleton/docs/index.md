# KCD Lima — Carrera de Chasquis

Demo Quarkus + Quinoa: carrera en equipo alrededor de Machu Picchu. Los jugadores se unen desde el móvil, generan energía y el dashboard muestra la carrera en vivo.

## El juego

Antes de arrancar, los jugadores eligen equipo y esperan la partida.

![Elige tu equipo](choose-team.png)

![Esperando partida](waiting-for-game.png)

El operador usa el dashboard para iniciar la carrera.

![Inicio de carrera](race-start.jpg)

Durante la carrera, ambos equipos generan energía y los chasquis avanzan por el circuito.

![Carrera en curso](race.jpg)

En el móvil, los jugadores tocan el badge para enviar energía.

![Generar energía](player-power.png)

Al final, el dashboard muestra el equipo ganador y la clasificación.

![Fin de carrera](race-end.jpg)

### Dashboard (login)

La pantalla `/dashboard` está protegida. Credenciales por defecto: `developer` / `kcdlima2026`.

![Login](login.png)

## Correr en modo dev

```bash
./mvnw quarkus:dev
```

- Jugadores: http://localhost:8080/
- Dashboard: http://localhost:8080/dashboard

## Personalizar

Ver `src/main/webui/src/Config.js` para equipos, potencia y sensores.
