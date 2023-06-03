import mongoose from "mongoose";
import User, { IUser } from "../src/models/user";

describe("User", () => {
  it("should create an instance of User with correct properties", () => {
    // Przygotowanie danych testowych
    const username = "JohnDoe";
    const email = "john.doe@example.com";
    const password = "password123";
    const lists = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
    ];

    // Tworzenie instancji User
    const user: IUser = new User({
      username: username,
      email: email,
      password: password,
      lists: lists,
    });

    // Sprawdzenie oczekiwanych wartości
    expect(user).toBeInstanceOf(User);
    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
    expect(user.lists).toEqual(lists);
  });
});
