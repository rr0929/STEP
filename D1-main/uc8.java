import java.util.HashMap;
import java.util.Map;

public class OopsBannerUC8 {
    private static final Map<Character, String[]> patternMap = new HashMap<>();

    static {
        patternMap.put('O', new String[]{"  *** ", " * * ", " * * ", " * * ", " * * ", " * * ", "  *** "});
        patternMap.put('P', new String[]{" **** ", " * * ", " * * ", " **** ", " * ", " * ", " * "});
        patternMap.put('S', new String[]{"  **** ", " * ", " * ", "  *** ", "     * ", "     * ", " **** "});
    }

    public static void main(String[] args) {
        renderBanner("OOPS");
    }

    public static void renderBanner(String word) {
        for (int i = 0; i < 7; i++) {
            StringBuilder lineResult = new StringBuilder();
            for (char c : word.toUpperCase().toCharArray()) {
                if (patternMap.containsKey(c)) {
                    lineResult.append(patternMap.get(c)[i]);
                }
            }
            System.out.println(lineResult.toString());
        }
    }
}