import { Evento, Inscrito } from '../../types';
import { EventService } from '../interfaces/EventService';

const STORAGE_KEY = 'uninassau_eventos_v1';
const ADMIN_KEY = 'is_admin';

export class LocalStorageService implements EventService {
    async getEvents(): Promise<Evento[]> {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);

        // Initial Seed Data
        const initialData: Evento[] = [
            {
                id: '1',
                nome: 'Workshop de Inovação Tecnológica e IA',
                data: '2025-01-09',
                horario: '14:00 - 18:00',
                descricao: 'Um encontro exclusivo para discutir o futuro da tecnologia aplicada aos negócios. Garanta sua vaga preenchendo o formulário.',
                local: 'Auditório UNINASSAU Boa Viagem',
                encerrado: false,
                inscritos: []
            }
        ];
        this.saveEventsInternal(initialData);
        return initialData;
    }

    async getEventById(id: string): Promise<Evento | undefined> {
        const events = await this.getEvents();
        return events.find(e => e.id === id);
    }

    async createEvent(eventoData: Omit<Evento, 'id' | 'inscritos' | 'encerrado'>): Promise<Evento> {
        const events = await this.getEvents();
        const newEvent: Evento = {
            ...eventoData,
            id: Math.random().toString(36).substr(2, 9),
            inscritos: [],
            encerrado: false
        };

        events.unshift(newEvent);
        this.saveEventsInternal(events);
        return newEvent;
    }

    async updateEvent(evento: Evento): Promise<Evento> {
        const events = await this.getEvents();
        const index = events.findIndex(e => e.id === evento.id);
        if (index !== -1) {
            events[index] = evento;
            this.saveEventsInternal(events);
        }
        return evento;
    }

    async closeEvent(id: string): Promise<void> {
        const events = await this.getEvents();
        const updatedEvents = events.map(e => e.id === id ? { ...e, encerrado: true } : e);
        this.saveEventsInternal(updatedEvents);
    }

    async reopenEvent(id: string): Promise<void> {
        const events = await this.getEvents();
        const updatedEvents = events.map(e => e.id === id ? { ...e, encerrado: false } : e);
        this.saveEventsInternal(updatedEvents);
    }

    async registerSubscriber(eventoId: string, inscritoData: Omit<Inscrito, 'id' | 'dataInscricao'>): Promise<Inscrito> {
        const events = await this.getEvents();
        let createdInscrito: Inscrito | undefined;

        const updatedEvents = events.map(e => {
            if (e.id === eventoId) {
                createdInscrito = {
                    ...inscritoData,
                    id: Math.random().toString(36).substring(2, 9),
                    dataInscricao: new Date().toISOString(),
                    checkedIn: false,
                    qrToken: Math.random().toString(36).substring(2, 9)
                };
                return { ...e, inscritos: [...e.inscritos, createdInscrito] };
            }
            return e;
        });

        this.saveEventsInternal(updatedEvents);

        if (!createdInscrito) {
            throw new Error('Evento não encontrado');
        }

        return createdInscrito;
    }

    async deleteEvent(id: string): Promise<void> {
        const events = await this.getEvents();
        const updatedEvents = events.filter(e => e.id !== id);
        this.saveEventsInternal(updatedEvents);
    }

    async deleteRegistration(id: string): Promise<void> {
        const events = await this.getEvents();
        const updatedEvents = events.map(e => ({
            ...e,
            inscritos: e.inscritos.filter(i => i.id !== id)
        }));
        this.saveEventsInternal(updatedEvents);
    }

    async validateCheckin(token: string): Promise<{ success: boolean; message: string; inscrito?: Inscrito }> {
        const events = await this.getEvents();
        let foundInscrito: Inscrito | undefined;
        let eventId: string | undefined;

        for (const e of events) {
            const ins = e.inscritos.find(i => i.qrToken === token);
            if (ins) {
                foundInscrito = ins;
                eventId = e.id;
                break;
            }
        }

        if (!foundInscrito || !eventId) {
            return { success: false, message: 'QR Code inválido ou não encontrado.' };
        }

        if (foundInscrito.checkedIn) {
            return { success: false, message: 'Este QR Code já foi utilizado para check-in.', inscrito: foundInscrito };
        }

        foundInscrito.checkedIn = true;
        foundInscrito.checkinDate = new Date().toISOString();

        const updatedEvents = events.map(e => {
            if (e.id === eventId) {
                return {
                    ...e,
                    inscritos: e.inscritos.map(i => i.id === foundInscrito!.id ? foundInscrito! : i)
                };
            }
            return e;
        });

        this.saveEventsInternal(updatedEvents);

        return {
            success: true,
            message: 'Entrada confirmada com sucesso!',
            inscrito: foundInscrito
        };
    }

    async uploadImage(file: File): Promise<string> {
        return URL.createObjectURL(file);
    }

    isAdmin(): boolean {
        return localStorage.getItem(ADMIN_KEY) === 'true';
    }

    setAdmin(isAdmin: boolean): void {
        if (isAdmin) {
            localStorage.setItem(ADMIN_KEY, 'true');
        } else {
            localStorage.removeItem(ADMIN_KEY);
        }
    }

    private saveEventsInternal(events: Evento[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
}
