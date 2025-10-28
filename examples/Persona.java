import java.util.ArrayList;

/**
 * Clase que representa una Persona con nombre, edad y lista de habilidades
 * Ejemplo completo de Java con getters, setters, constructores y métodos
 */
public class Persona {
    // Atributos privados
    private String nombre;
    private int edad;
    private ArrayList<String> habilidades;
    
    // Constructor sin parámetros
    public Persona() {
        this.nombre = "Sin nombre";
        this.edad = 0;
        this.habilidades = new ArrayList<>();
    }
    
    // Constructor con parámetros
    public Persona(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
        this.habilidades = new ArrayList<>();
    }
    
    // Getters y Setters
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public int getEdad() {
        return edad;
    }
    
    public void setEdad(int edad) {
        if (edad >= 0) {
            this.edad = edad;
        }
    }
    
    public ArrayList<String> getHabilidades() {
        return habilidades;
    }
    
    // Métodos personalizados
    public void agregarHabilidad(String habilidad) {
        this.habilidades.add(habilidad);
        System.out.println("✅ Habilidad agregada: " + habilidad);
    }
    
    public void mostrarHabilidades() {
        System.out.println("\n🎯 Habilidades de " + nombre + ":");
        for (String habilidad : habilidades) {
            System.out.println("  - " + habilidad);
        }
    }
    
    public boolean esMayorDeEdad() {
        return edad >= 18;
    }
    
    public void cumplirAnios() {
        edad++;
        System.out.println("🎂 ¡Feliz cumpleaños! Ahora tienes " + edad + " años");
    }
    
    // toString para representación en String
    @Override
    public String toString() {
        return "Persona{" +
               "nombre='" + nombre + '\'' +
               ", edad=" + edad +
               ", habilidades=" + habilidades.size() +
               '}';
    }
    
    // Método main para probar la clase
    public static void main(String[] args) {
        // Crear una persona
        Persona persona1 = new Persona("Juan", 25);
        
        // Agregar habilidades
        persona1.agregarHabilidad("Java");
        persona1.agregarHabilidad("Python");
        persona1.agregarHabilidad("JavaScript");
        
        // Mostrar información
        System.out.println("\n📋 Información:");
        System.out.println(persona1);
        persona1.mostrarHabilidades();
        
        // Verificar si es mayor de edad
        if (persona1.esMayorDeEdad()) {
            System.out.println("\n✅ " + persona1.getNombre() + " es mayor de edad");
        }
        
        // Cumplir años
        persona1.cumplirAnios();
        
        // Crear otra persona con constructor vacío
        Persona persona2 = new Persona();
        persona2.setNombre("María");
        persona2.setEdad(17);
        
        System.out.println("\n" + persona2);
    }
}
