package com.lostpetfinder;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

public class SeleniumDriverTests {
    @Test
    public void testLoginGoodCreds() {
        WebDriver driver = new ChromeDriver();
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\akrkl\\AppData\\Local\\Microsoft\\WindowsApps\\chromedriver.exe");
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        //driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driver.get("http://localhost:5173/login");

        WebElement element = driver.findElement(By.id("email"));
        element.sendKeys("testadmin");

        element = driver.findElement(By.id("lozinka"));
        element.sendKeys("123");

        driver.findElement(By.cssSelector("button[type='submit']")).click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        try {
            wait.until(ExpectedConditions.presenceOfElementLocated(By.id("searchBarByCategories")));

            String redirectUrl = driver.getCurrentUrl();

            Assertions.assertEquals("http://localhost:5173/", redirectUrl);
        }
        finally {
            driver.quit();
        }
    }

    @Test
    public void testLoginBadCreds() {
        WebDriver driver = new ChromeDriver();
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\akrkl\\AppData\\Local\\Microsoft\\WindowsApps\\chromedriver.exe");
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        //driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driver.get("http://localhost:5173/login");

        WebElement element = driver.findElement(By.id("email"));
        element.sendKeys("testadmin");

        element = driver.findElement(By.id("lozinka"));
        element.sendKeys("wrongPassword");

        driver.findElement(By.cssSelector("button[type='submit']")).click();

        try {
            String redirectUrl = driver.getCurrentUrl();

            Assertions.assertNotEquals("http://localhost:5173/", redirectUrl);
        }
        finally {
            driver.quit();
        }
    }

}
