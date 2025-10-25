import java.util.Scanner;

public class HelloJava {
    public static void main(String[] args) {
        // Ejemplo de Java con System.out y Scanner
        System.out.println("=== Bienvenido al Editor de Java ===");
        
        // Variables
        String nombre = "Desarrollador";
        int edad = 25;
        double salario = 50000.50;
        
        // Imprimir variables
        System.out.println("Nombre: " + nombre);
        System.out.println("Edad: " + edad);
        System.out.println("Salario: $" + salario);
        
        // Scanner para entrada de usuario
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("\n=== Entrada de Usuario ===");
        System.out.print("Ingrese su nombre: ");
        String userNombre = scanner.nextLine();
        
        System.out.print("Ingrese su edad: ");
        int userEdad = scanner.nextInt();
        
        // Procesamiento
        System.out.println("\n=== Resultado ===");
        System.out.println("Hola, " + userNombre + "!");
        System.out.println("En 10 años tendrás " + (userEdad + 10) + " años.");
        
        // Operaciones matemáticas
        int suma = 10 + 5;
        int multiplicacion = 4 * 3;
        System.out.println("Suma: 10 + 5 = " + suma);
        System.out.println("Multiplicación: 4 * 3 = " + multiplicacion);
        
        scanner.close();
    }
}
