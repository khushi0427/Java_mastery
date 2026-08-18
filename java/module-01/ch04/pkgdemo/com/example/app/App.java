package com.example.app;
import com.example.util.Helper;
public class App {
    public static void main(String[] args) {
        System.out.println(Helper.greet());
        System.out.println("this class: " + App.class.getName());
        System.out.println("package: " + App.class.getPackageName());
    }
}
