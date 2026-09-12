import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Vibration, DeviceEventEmitter } from 'react-native';
import { getSocket, initSocket } from '../api/socketClient';
import Sound from 'react-native-sound';
import InCallManager from 'react-native-incall-manager';

// Enable playback in silence mode
Sound.setCategory('Playback');

interface IncomingCall {
  request_id: number;
  name: string;
  avatar_url: string;
  call_type: 'audio' | 'video';
  caller_id: number;
}

interface CallOverlayContextProps {
  currentCall: IncomingCall | null;
  timeLeft: number;
  acceptCall: () => void;
  declineCall: () => void;
}

const CallOverlayContext = createContext<CallOverlayContextProps | undefined>(undefined);

export const CallOverlayProvider: React.FC<{ children: React.ReactNode; onNavigateToCall: (call: IncomingCall) => void }> = ({ children, onNavigateToCall }) => {
  const [currentCall, setCurrentCall] = useState<IncomingCall | null>(null);
  const [timeLeft, setTimeLeft] = useState(35);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Keep a ref so the timer interval can access the current call without stale closure
  const currentCallRef = useRef<IncomingCall | null>(null);

  const updateCurrentCall = (call: IncomingCall | null) => {
    currentCallRef.current = call;
    setCurrentCall(call);
  };

  const stopRingtone = () => {
    InCallManager.stopRingtone();
  };

  const playRingtone = () => {
    stopRingtone();
    // Vibrate device continuously while ringing
    Vibration.vibrate([0, 1000, 1000], true);
    
    // Play the default native system ringtone
    InCallManager.startRingtone('_DEFAULT_');
  };

  const clearCall = useCallback(() => {
    updateCurrentCall(null);
    setTimeLeft(35);
    stopRingtone();
    Vibration.cancel();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    let socket = getSocket();

    const setupSocket = async () => {
      if (!socket) {
        socket = await initSocket();
      }
      if (!socket) return;

      const handleIncomingCall = (data: any) => {
        const newCall: IncomingCall = {
          request_id: data.callId,
          name: data.name || 'User',
          avatar_url: data.avatar_url,
          call_type: data.call_type || data.type,
          caller_id: data.callerId,
        };
        updateCurrentCall(newCall);
        setTimeLeft(35);
        playRingtone();

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              const expiredCall = currentCallRef.current;
              if (expiredCall) {
                const s = getSocket();
                if (s) {
                  s.emit('decline_call', {
                    callId: expiredCall.request_id,
                    callerId: expiredCall.caller_id,
                  });
                }
              }
              clearCall();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };

      socket.on('incoming_call', handleIncomingCall);
      DeviceEventEmitter.addListener('fcm_incoming_call', handleIncomingCall);
    };

    setupSocket();

    return () => {
      if (socket) {
        socket.off('incoming_call');
      }
      DeviceEventEmitter.removeAllListeners('fcm_incoming_call');
      clearCall();
    };
  }, [clearCall]);

  const acceptCall = () => {
    if (!currentCall) return;
    const socket = getSocket();
    if (socket) {
      socket.emit('accept_call', { callId: currentCall.request_id, callerId: currentCall.caller_id });
    }
    const callData = currentCall;
    clearCall();
    onNavigateToCall(callData);
  };

  const declineCall = () => {
    if (!currentCall) return;
    const socket = getSocket();
    if (socket) {
      socket.emit('decline_call', { callId: currentCall.request_id, callerId: currentCall.caller_id });
    }
    clearCall();
  };

  return (
    <CallOverlayContext.Provider value={{ currentCall, timeLeft, acceptCall, declineCall }}>
      {children}
    </CallOverlayContext.Provider>
  );
};

export const useCallOverlay = () => {
  const context = useContext(CallOverlayContext);
  if (!context) {
    throw new Error('useCallOverlay must be used within a CallOverlayProvider');
  }
  return context;
};
