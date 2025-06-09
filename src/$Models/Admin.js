import { Instructor } from "./Instructor";
import { Assigment, Question } from "./Utils/Assigments";
import { Category, SubCategory } from "./Utils/Category";

export class Admin extends Instructor {
  static Category = Category;
  static SubCategory = SubCategory;
  static Assigment = Assigment;
  static Question = Question;
}
