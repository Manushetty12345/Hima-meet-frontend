import apiClient from './apiClient';

export type Ticket = {
  id: string;
  title: string;
  status: 'ACTIVE' | 'RESOLVED';
  date: string;
  // Based on your real backend schema, there might be other fields like:
  // created_at: string;
  // user_id: string;
};

/**
 * Creates a new support ticket.
 * @param title The issue description
 */
export const createTicket = async (title: string): Promise<Ticket> => {
  try {
    const response = await apiClient.post('/api/support/tickets', { title });
    // Assuming the backend returns the created ticket
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

/**
 * Fetches all tickets for the current user.
 */
export const getTickets = async (): Promise<Ticket[]> => {
  try {
    const response = await apiClient.get('/api/support/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};
