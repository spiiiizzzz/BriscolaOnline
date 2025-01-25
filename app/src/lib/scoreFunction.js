function compareRank(first, second) {
    const order = [2, 4, 5, 6, 7, 8, 9, 10, 3, 1];

    return order.indexOf(first.rank) > order.indexOf(second.rank);
}

export function firstScored(first, second, briscola) {
    if (first.suit === second.suit) {
        return compareRank(first, second)
    } else if (first.suit === briscola) {
        return true;
    } else if (second.suit === briscola) {
        return false;
    } else {
        return true;
    }
}

export function score(scoredCards) {
    let res = 0;
    for (let card of scoredCards) {
        switch (card.rank) {
            case 10:
                res += 4;
                break;
            case 9:
                res += 3;
                break;
            case 8:
                res += 2;
                break;
            case 1:
                res += 11;
                break;
            case 3:
                res += 10;
                break;
        }
    }

    return res;
}