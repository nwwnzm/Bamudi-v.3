import React from 'react';
import { Tutorial, Language, CompetencyLevel } from '../../types';
import { translations } from '../../data/translations';
import {
  Bookmark,
  Clock,
  CheckCircle2,
  ArrowRight,
  Monitor,
  FolderKanban,
  ArrowDownUp,
  Compass,
  Presentation,
  Palette,
  FileCheck2,
  GraduationCap,
  Sparkles,
  Terminal,
  BookOpenCheck,
  ShieldCheck,
  SearchCheck,
  Gamepad2,
  Dices,
  Tv,
  MessageSquareText,
  Sprout,
  Compass as CompassIcon,
  Zap,
} from 'lucide-react';

interface Props {
  tutorial: Tutorial;
  language: Language;
  onSelect: (tutorial: Tutorial) => void;
  isCompleted: boolean;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Monitor,
  FolderKanban,
  ArrowDownUp,
  Compass,
  Presentation,
  Palette,
  FileCheck2,
  GraduationCap,
  Sparkles,
  Terminal,
  BookOpenCheck,
  ShieldCheck,
  SearchCheck,
  Gamepad2,
  Dices,
  Tv,
  MessageSquareText,
};

const LEVEL_CONFIG: Record<
  CompetencyLevel,
  {
    badgeClass: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    accentBorder: string;
  }
> = {
  beginner: {
    badgeClass: 'bg-sky-50 text-[#0066cc] border-sky-200',
    icon: Sprout,
    iconBg: 'bg-sky-100 group-hover:bg-[#0099ff]',
    iconColor: 'text-[#0088ee] group-hover:text-white',
    accentBorder: 'hover:border-[#0099ff]',
  },
  intermediate: {
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: CompassIcon,
    iconBg: 'bg-blue-100 group-hover:bg-blue-600',
    iconColor: 'text-blue-700 group-hover:text-white',
    accentBorder: 'hover:border-blue-400',
  },
  advanced: {
    badgeClass: 'bg-[#fdf2f0] text-[#99240b] border-[#cc310e]/40',
    icon: Zap,
    iconBg: 'bg-[#fdf2f0] group-hover:bg-[#cc310e]',
    iconColor: 'text-[#cc310e] group-hover:text-white',
    accentBorder: 'hover:border-[#cc310e]',
  },
};

export const TutorialCard: React.FC<Props> = ({
  tutorial,
  language,
  onSelect,
  isCompleted,
  isSaved,
  onToggleSave,
}) => {
  const t = translations[language];
  const IconComponent = ICON_MAP[tutorial.iconName] || Monitor;
  const levelStyle = LEVEL_CONFIG[tutorial.level] || LEVEL_CONFIG.beginner;
  const LevelIcon = levelStyle.icon;

  const levelLabel = t.levels[tutorial.level];
  const categoryLabel = t.categories[tutorial.category];

  return (
    <div
      onClick={() => onSelect(tutorial)}
      className={`group relative bg-white border border-slate-200/90 ${levelStyle.accentBorder} rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between`}
    >
      <div>
        {/* Top Header: Distinct Level Badge + Category & Bookmark */}
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Visual Level Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${levelStyle.badgeClass}`}
            >
              <LevelIcon className="w-3 h-3" />
              <span>{levelLabel}</span>
            </span>

            <span aria-hidden="true" className="text-slate-300">·</span>

            <span className="font-semibold text-slate-600 tracking-tight text-[11px]">
              {categoryLabel}
            </span>
          </div>

          <button
            onClick={(e) => onToggleSave(tutorial.id, e)}
            title={isSaved ? t.tutorialExperience.saved : t.tutorialExperience.saveTutorial}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isSaved
                ? 'text-[#cc310e] bg-[#fdf2f0] hover:bg-[#fde4df]'
                : 'text-slate-400 hover:text-[#0099ff] hover:bg-sky-50'
            }`}
            aria-label="Bookmark tutorial"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#cc310e] text-[#cc310e]' : ''}`} />
          </button>
        </div>

        {/* Thumbnail Icon Area */}
        <div className="flex items-start gap-3.5 mb-3">
          <div
            className={`w-12 h-12 rounded-2xl ${levelStyle.iconBg} ${levelStyle.iconColor} transition-all flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105`}
          >
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0099ff] transition-colors leading-snug font-display">
              {tutorial.title[language]}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed ml-15.5 mb-5 font-normal">
          {tutorial.description[language]}
        </p>
      </div>

      {/* Footer Info: Estimated Time & Rounded Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[#0066cc] font-bold bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0099ff]" />
              {t.tutorialExperience.completed}
            </span>
          ) : (
            <span className="text-slate-500 font-semibold text-[11px] bg-slate-100 px-2.5 py-0.5 rounded-full">
              {tutorial.toolBadge}
            </span>
          )}

          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
            <Clock className="w-3 h-3 text-slate-400" />
            {tutorial.estimatedMinutes} {t.common.minute}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 font-bold text-[#007acc] group-hover:text-[#0055aa] transition-colors">
          <span>{t.common.viewTutorial}</span>
          <div className="w-6 h-6 rounded-full bg-sky-100 group-hover:bg-[#0099ff] text-[#007acc] group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-1">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
