#!/bin/bash
echo "Apply database migrations"
npm run database-up
echo "Running server"
npm start