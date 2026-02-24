public class OopsBannerUC5 {
    public static void main(String[] args) {
        // Inline initialization: Cleaner and more concise
        String[] banner = {
            String.join("", "  *** ", "  *** ", " **** ", "  **** "),
            String.join("", " * * ", " * * ", " * * ", " * "),
            String.join("", " * * ", " * * ", " * * ", " * "),
            String.join("", " * * ", " * * ", " **** ", "  *** "),
            String.join("", " * * ", " * * ", " * ", "     * "),
            String.join("", " * * ", " * * ", " * ", "     * "),
            String.join("", "  *** ", "  *** ", " * ", " **** ")
        };

        for (String line : banner) {
            System.out.println(line);
        }
    }
}