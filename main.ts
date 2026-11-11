/**
 * Das Nim-Spiel (einfache Variante) Mit OLED-Display
 * 
 * Taste A: Anzahl auswählen (1,2 oder 3)
 * 
 * Taste B: Aktion ausführen
 * 
 * Taste A+B: Anzeige verbliebene Hölzer
 * 
 * Näheres bei Wikipedia oder demnächst bei 
 * 
 * https://www.prof-horst-guenther.de/calliope
 */
function zeigeHolz (spalte: number, zeile: number) {
    writeat(2 + zeile, spalte, "O")
    writeat(3 + zeile, spalte, "|")
    writeat(4 + zeile, spalte, "|")
}
function writeat (zeile: number, spalte: number, Text: string) {
    oledssd1306.setTextXY(zeile, spalte)
    oledssd1306.writeString(Text)
}
function ziehen () {
    writeat(0, 0, "Bitte ziehen:")
    writeat(0, 13, "" + convertToText(succ(Letztes)) + " ")
    if (MIT_LED) {
        basic.showNumber(succ(Letztes))
    }
}
function runter (pos: number) {
    löscheHolz(pos, 0)
    zeigeHolz(pos, 3)
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (Start == 0) {
        oledssd1306.clearDisplay()
        Start = 1
        nimm = 1
        Hoelzer[Letztes] = 2
        zeigeHölzer()
        ziehen()
    } else {
        nimm += 1
        if (nimm == 4) {
            nimm = 1
            Hoelzer[prev(Letztes)] = 1
            Hoelzer[prev(prev(Letztes))] = 1
            hoch(prev(Letztes))
            hoch(prev(prev(Letztes)))
        } else {
            runter(Letztes - prev(nimm))
        }
    }
})
function computerNimmt () {
    nimm = succ(Letztes) % 4
    if (nimm == 0) {
        nimm = 1
    }
    writeat(0, 0, "Comuter nimmt " + nimm + " ")
    for (let i = 0; i <= prev(nimm); i++) {
        runter(Letztes - i)
    }
    basic.pause(3000)
    for (let i = 0; i <= prev(nimm); i++) {
        löscheHolz(Letztes - i, 3)
        Hoelzer.pop()
    }
    Letztes = Letztes - nimm
    if (Letztes <= 0) {
        music.play(music.tonePlayable(131, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        writeat(0, 0, "Du hast verloren")
        while (true) {
        	
        }
    } else {
        ziehen()
        runter(Letztes)
        nimm = 1
    }
}
function succ (wert: number) {
    return wert + 1
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    MIT_LED = !(MIT_LED)
})
function zeigeHölzer () {
    for (let Index = 0; Index <= 15; Index++) {
        if (Hoelzer[Index] == 1) {
            zeigeHolz(Index, 0)
        } else {
            if (Hoelzer[Index] == 2) {
                zeigeHolz(Index, 3)
            }
        }
    }
}
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    if (Start == 0) {
        oledssd1306.clearDisplay()
        Start = 1
        zeigeHölzer()
        computerNimmt()
    } else {
        for (let i = 0; i <= prev(nimm); i++) {
            löscheHolz(Letztes - i, 3)
            Hoelzer.pop()
        }
        Letztes = Letztes - nimm
        if (Letztes <= 0) {
            music.play(music.tonePlayable(988, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
            basic.showIcon(IconNames.Yes)
            writeat(0, 0, "Du gewinnst   ")
            while (true) {
            	
            }
        } else {
            ziehen()
            runter(Letztes)
            nimm = 1
        }
        computerNimmt()
    }
})
function hoch (pos: number) {
    löscheHolz(pos, 3)
    zeigeHolz(pos, 0)
}
function prev (wert: number) {
    return wert - 1
}
function löscheHolz (spalte: number, zeile: number) {
    writeat(2 + zeile, spalte, " ")
    writeat(3 + zeile, spalte, " ")
    writeat(4 + zeile, spalte, " ")
}
let nimm = 0
let Hoelzer: number[] = []
let Letztes = 0
let Start = 0
let MIT_LED = false
MIT_LED = false
oledssd1306.initDisplay()
Start = 0
let ANZAHL = 16
Letztes = prev(ANZAHL)
Hoelzer = [1]
for (let Index = 0; Index <= prev(Letztes); Index++) {
    Hoelzer.push(1)
}
writeat(0, 0, "Wer startet?")
writeat(2, 0, "A: Du")
writeat(4, 0, "B: Computer")
writeat(6, 0, "A+B: Anzeige")
