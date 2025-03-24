# **How to Run, Build, and Test the Project**

## **1. Prerequisites**

Before you can run the project, make sure you have the following installed:

- **Node.js** (version 14 or higher) – [Download Node.js here](https://nodejs.org/)
- **npm** (npm comes with Node.js)
- **PostgreSQL** (or another database if you want to use one)

### **2. Getting Started**

First, download the project to your computer.

```bash
git clone https://github.com/lee-kol/TDP-Homework
cd TDP-Homework
```
After that, you need to install the libraries (dependencies) that the project needs. Run this command:

```bash
npm install
```

This will automatically download all the necessary files.

### **3. Setup Database**

Create a .env file like this:

```bash
DB_HOST=localhost
DB_PORT=<port>
DB_USER=<username>
DB_PASSWORD=<password>
DB_NAME=<db_name>
```

### **4. Running the App**

Now, you are ready to run the project. You can start the app by typing this:

```bash
npm run start
```

This will start the server, and you can visit http://localhost:3000 to see the app running.
If you want the app to restart automatically as you make changes, you can use:

```bash
npm run start:dev
```

This is very helpful when you’re coding because it keeps refreshing the server for you.

### **5. Build the Project**

When you're ready to prepare the app for production, you can build it with:

```bash
npm run build
```

This will make a compiled version of the app inside the dist folder.

### **6. Running the Tests**

The project includes unit tests that check if everything is working properly. To run all tests, use this:

```bash
npm run test
```

---

## **Troubleshooting**

Here are some things that might go wrong and how to fix them:

### **1. "Cannot find module" error**

If you see this error, it might mean that something is missing or not imported properly. Check that you’ve imported everything correctly.

### **2. "Database connection error"**

Make sure PostgreSQL is running. Also, check that the username, password, and database name are correct in the `ormconfig.json` file.

---

## **Where to Learn More**

If you want to learn more about how this project works, here are some helpful links:

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)