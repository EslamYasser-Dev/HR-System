# Workforce Managmnet App

## Overview

This document provides an overview and documentation for the workforce Backend

## Table of Contents

- [1. Installation](#1-installation)
- [2. Configuration](#2-configuration)
- [3. Usage](#3-usage)
- [4. Folder Structure](#4-folder-structure)

## 1. Installation

To run the Node.js app locally, follow these steps:

1. Clone the repository

2. then move to RF directiory

3. install dependencies via npm:

    ```bash
        npm i
    ```

4. Ensure that you are using linux(Debian Based one ex: ubuntu) had installed mongoDB in you system as a fallback if the main database down

## 2. Configuration

create .env file in project's root directory in simply copy and paste these inside .env file :

    ```bash
        PORT = <add your port>
        MONGO_URL = "your monogo connection string"
        SOCKET_EVENT_NAME = "mqtt-message"
        ORIGIN = "set origin"
    ```

## 3. Usage

now in you terminal

    ```bash
    npm run dev 
    ```

    or

    ```bash
    npm start
    ```
