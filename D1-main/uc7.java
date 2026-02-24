public class OopsBannerUC7 {
    public static void main(String[] args) {
        CharacterPatternMap charO = new CharacterPatternMap('O', new String[]{"  *** ", " * * ", " * * ", " * * ", " * * ", " * * ", "  *** "});
        CharacterPatternMap charP = new CharacterPatternMap('P', new String[]{" **** ", " * * ", " * * ", " **** ", " * ", " * ", " * "});
        CharacterPatternMap charS = new CharacterPatternMap('S', new String[]{"  **** ", " * ", " * ", "  *** ", "     * ", "     * ", " **** "});

        for (int i = 0; i < 7; i++) {
            StringBuilder sb = new StringBuilder();
            sb.append(charO.getLine(i));
            sb.append(charO.getLine(i));
            sb.append(charP.getLine(i));
            sb.append(charS.getLine(i));
            System.out.println(sb.toString());
        }
    }
}

class CharacterPatternMap {
    private char character;
    private String[] pattern;

    public CharacterPatternMap(char character, String[] pattern) {
        this.character = character;
        this.pattern = pattern;
    }

    public String getLine(int index) {
        return pattern[index];
    }
}