import { api } from '../config/api';

export type CreateRatingPayload = {
  idComprador: number;
  idVendedor: number;
  nombreComprador: string;
  puntuacion: number;         // 1..5
  comentario?: string | null; // opcional
};

export type VotePayload = {
  idUsuario: number;
  voto: 'up' | 'down';
};

export type DeleteReviewPayload = {
  idComprador: number;
};


export const ratingsService = {
  async getAverage(productId: number) {
    const { data } = await api.get(`/ratings/${productId}/average`);
    // { productId, average, count }
    return data as { productId: number; average: number; count: number };
  },

  async listComments(productId: number, limit = 10, offset = 0) {
    const { data } = await api.get(`/ratings/${productId}/comments`, {
      params: { limit, offset },
    });
    // Respuesta: { items, total, limit, offset }
    return data as {
      items: Array<{
        idResena: string;
        comentario: string | null;
        puntuacion: number;
        fecha: string;
        idComprador: number;
        nombreComprador: string;
        votos: { up: number; down: number };
      }>;
      total: number;
      limit: number;
      offset: number;
    };
  },

  async rateProduct(productId: number, payload: CreateRatingPayload) {
    const { data } = await api.post(`/ratings/${productId}`, payload);
    // { idResena, action?: 'created' | 'updated' }
    return data as { idResena: string; action?: 'created' | 'updated' };
  },

  async voteReview(idResena: string, payload: VotePayload) {
    const { data } = await api.post(`/ratings/comments/${idResena}/vote`, payload);
    // { status: 'ok' }
    return data as { status: 'ok' };
    
  },
  async deleteReview(idResena: string, payload: DeleteReviewPayload) {
  const { data } = await api.delete(`/ratings/comments/${idResena}`, {
    data: payload,
  });
  // { status: 'deleted' }
  return data as { status: 'deleted' };
},

};