import React from 'react';
import { useTranslation } from 'react-i18next';
import VectorImage from '../../assets/Vector.png';
import BlueArrow from '../../assets/bluearrow.png';

interface RApprovedProps {
  onClose?: () => void;
  onHome?: () => void;
}

const RApproved: React.FC<RApprovedProps> = ({ onClose, onHome }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white w-full min-h-[450px] flex flex-col items-center justify-center py-16 px-8 relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light"
        >
          ×
        </button>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center">
        {/* Checkmark Icon */}
        <div className="mb-8">
          <img
            src={VectorImage}
            alt="Confirmed"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Confirmation Text */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
          {t('rental.approved.title')}
        </h2>
        <p className="text-gray-500 text-center mb-8">
          {t('rental.approved.message')}
        </p>

        {/* Home Button */}
        <button
          onClick={onHome}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-sm transition-all flex items-center gap-2 shadow-sm"
        >
          {t('rental.approved.go_home')}
          <img src={BlueArrow} alt="arrow" className="w-5 h-5 brightness-0 invert" />
        </button>
      </div>
    </div>
  );
};

export default RApproved;