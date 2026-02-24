public class OopsBannerUC6 {
    public static void main(String[] args) {
        String[] banner = new String[7];

        for (int i = 0; i < 7; i++) {
            banner[i] = String.join("", getO(i), getO(i), getP(i), getS(i));
        }

        for (String line : banner) {
            System.out.println(line);
        }
    }

    static String getO(int line) {
        String[] pattern = {"  *** ", " * * ", " * * ", " * * ", " * * ", " * * ", "  *** "};
        return pattern[line];
    }

    static String getP(int line) {
        String[] pattern = {" **** ", " * * ", " * * ", " **** ", " * ", " * ", " * "};
        return pattern[line];
    }

    static String getS(int line) {
        String[] pattern = {"  **** ", " * ", " * ", "  *** ", "     * ", "     * ", " **** "};
        return pattern[line];
    }
}