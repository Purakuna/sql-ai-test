// propiedades de una sola letra para reducir el tamaño del payload
export interface InitialData {
    ts: {
      t: string;
      d: {
        cn: string;
        cv: string;
      }[];
    }[];
}
