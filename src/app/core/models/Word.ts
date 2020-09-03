export class Word {
    id?: string;
    list_id: string;
    original: string;
    translation: string;
    transcription: string;
    createdAt: Date;
    is_bookmarked?: boolean;
    uid?: string;
}