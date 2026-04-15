import React, { useState } from 'react';

interface QRCodeEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (texts: {
        mainTitle: string;
        subtitle: string;
        instruction: string;
        footer: string;
    }) => void;
    eventName: string;
    eventType?: string;
}

const QRCodeEditorModal: React.FC<QRCodeEditorModalProps> = ({
    isOpen,
    onClose,
    onGenerate,
    eventName,
    eventType
}) => {
    const isLinkExterno = eventType === 'link_externo';

    const defaultTitle = isLinkExterno ? 'JÁ FEZ SUA AV1?' : 'Faça sua Inscrição Online!';
    const defaultSubtitle = isLinkExterno ? 'Aproveite seu tempo de espera para participar da Avaliação Institucional.' : 'Evento UNINASSAU';
    const defaultInstruction = isLinkExterno ? 'Sua opinião contribui diretamente para a melhoria da instituição e ainda garante 3 horas de atividades complementares.' : 'Aponte a câmera do seu celular para o QR Code e se inscreva em segundos. Rápido, fácil e seguro!';
    const defaultFooter = isLinkExterno ? '☑ Garanta 3h complementares. Depois de finalizar, compareça lá no CRA.. 😉' : 'Inscrições gratuitas • Vagas limitadas • Garanta sua presença';

    const [mainTitle, setMainTitle] = useState(defaultTitle);
    const [subtitle, setSubtitle] = useState(defaultSubtitle);
    const [instruction, setInstruction] = useState(defaultInstruction);
    const [footer, setFooter] = useState(defaultFooter);

    if (!isOpen) return null;

    const handleGenerate = () => {
        onGenerate({
            mainTitle,
            subtitle,
            instruction,
            footer
        });
        onClose();
    };

    const handleReset = () => {
        setMainTitle(defaultTitle);
        setSubtitle(defaultSubtitle);
        setInstruction(defaultInstruction);
        setFooter(defaultFooter);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-primary p-6 text-white flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-black mb-2">Personalizar QR Code</h2>
                            <p className="text-primary-light/80 text-sm font-medium">
                                Edite os textos do cartaz de inscrição
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                    </div>
                </div>

                {/* Event Info */}
                {!isLinkExterno && (
                    <div className="bg-primary-light/10 px-6 py-3 border-b border-primary-light/20 flex-shrink-0">
                        <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Evento</p>
                        <p className="text-sm font-bold text-gray-800 line-clamp-2">{eventName}</p>
                    </div>
                )}

                {/* Form - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                            📢 Título Principal
                        </label>
                        <input
                            type="text"
                            value={mainTitle}
                            onChange={(e) => setMainTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder="Ex: Faça sua Inscrição Online!"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                            🏷️ Subtítulo
                        </label>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder="Ex: Evento UNINASSAU"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                            💬 Instrução de Uso
                        </label>
                        <textarea
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                            placeholder="Ex: Aponte a câmera do seu celular..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                            ✨ Rodapé / Destaque
                        </label>
                        <input
                            type="text"
                            value={footer}
                            onChange={(e) => setFooter(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder="Ex: Inscrições gratuitas • Vagas limitadas"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t flex gap-3 flex-shrink-0">
                    <button
                        onClick={handleReset}
                        className="flex-1 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-all"
                    >
                        Restaurar
                    </button>
                    <button
                        onClick={handleGenerate}
                        className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Gerar QR Code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeEditorModal;
