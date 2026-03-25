"use client";
interface AbandonPopupProps { isOpen: boolean; onClose: () => void; quizType: string; currentStep: number; }

export default function AbandonPopup({ isOpen, onClose, currentStep }: AbandonPopupProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="text-4xl mb-4">⏳</div>
        <h3 className="font-display text-2xl font-bold text-brand-dark mb-3">¡Ya casi terminas!</h3>
        <p className="text-gray-600 mb-2">Llevas <strong>{currentStep} de 10 preguntas</strong> respondidas.</p>
        <p className="text-gray-500 text-sm mb-6">Tu diagnóstico personalizado está a punto de estar listo. No pierdas tu progreso.</p>
        <div className="flex flex-col gap-3">
          <button onClick={onClose} className="w-full py-3 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold rounded-xl transition-colors">
            Continuar diagnóstico →
          </button>
          <a href="/" className="w-full py-3 border border-gray-200 text-gray-500 font-medium rounded-xl text-sm text-center hover:bg-gray-50 transition-colors">
            Salir (perderé mi progreso)
          </a>
        </div>
      </div>
    </div>
  );
}
