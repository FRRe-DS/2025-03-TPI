

export function getTransportMethodName(type: string): string {
    switch (type) {
        case "air":
            return "Avión";
        case "sea":
            return "Barco";
        case "road":
            return "Camión";
        case "rail":
            return "Tren";
        default:
            return "Otro";
    }
}