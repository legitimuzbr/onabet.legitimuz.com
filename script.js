$(document).ready(function() {
  var $inputCPF = $('#legitimuz-hydrate-cpf');
  var $button = $('#legitimuz-action-verify');
  var $aviso = $('#aviso');
  var countdownTimer;

  var lockPeriod = 0.1 * 3600 * 1000; // 24 horas em milissegundos -> 24 * 3600 * 1000

  function updateAviso(tempoRestante) {
    var horas = Math.floor(tempoRestante / (3600 * 1000));
    var minutos = Math.floor((tempoRestante % (3600 * 1000)) / (60 * 1000));
    var segundos = Math.floor((tempoRestante % (60 * 1000)) / 1000);
    $aviso.text(`Tempo restante: ${horas}h ${minutos}m ${segundos}s`);
  }

  function toggleAviso(shouldShow) {
    if (shouldShow) {
      $aviso.removeClass('d-none');
    } else {
      $aviso.addClass('d-none');
    }
  }

  function startCountdown(lockTime) {
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }

    countdownTimer = setInterval(function() {
      var currentTime = new Date().getTime();
      var tempoRestante = lockPeriod - (currentTime - lockTime);

      if (tempoRestante > 0) {
        updateAviso(tempoRestante);
      } else {
        clearInterval(countdownTimer);
        $button.prop('disabled', false);
        toggleAviso(false);
      }
    }, 1000);
  }

  function checkForUnlockParameter() {
    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('button') && searchParams.get('button') === 'visible') {
      localStorage.removeItem('buttonLockTime');
      $button.prop('disabled', false);
      $aviso.addClass('d-none');
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    }
  }

  function checkCpf() {
  var searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('cpf')) {
    var cpfValue = searchParams.get('cpf');
    $('#legitimuz-hydrate-cpf').val(cpfValue);
  }
}

  function initializeInput() {
    var savedCPF = localStorage.getItem('savedCPF');
    var lockTime = parseInt(localStorage.getItem('lockTime'), 10);
    var currentTime = new Date().getTime();

    if (savedCPF) {
      $inputCPF.val(savedCPF);
    }

    if (lockTime && currentTime - lockTime < lockPeriod) {
      $inputCPF.prop('readonly', true).addClass('disabled');
      $button.prop('disabled', true);
      startCountdown(lockTime);
      toggleAviso(true);
    } else {
      $inputCPF.prop('readonly', false).removeClass('disabled');
      $button.prop('disabled', false);
      toggleAviso(false);
    }

    checkForUnlockParameter();
    checkCpf()
  }

  window.lockButton = function() {
    var currentTime = new Date().getTime();
    var lockTime = parseInt(localStorage.getItem('lockTime'), 10);

    if (!lockTime || currentTime - lockTime >= lockPeriod) {
      localStorage.setItem('lockTime', currentTime.toString());
      $button.prop('disabled', true);
      startCountdown(currentTime);
      toggleAviso(true);
    } else {
      console.log('O botão já está bloqueado e não pode ser bloqueado novamente até que o tempo de bloqueio expire.');
    }
  };

  $button.click(function() {
    var cpfValue = $inputCPF.val();
    if (cpfValue) {
      localStorage.setItem('savedCPF', cpfValue);
      if (!lockTime || currentTime - lockTime >= lockPeriod) {
        localStorage.setItem('lockTime', currentTime.toString());
        $inputCPF.prop('readonly', true).addClass('disabled');
        $button.prop('disabled', true);
        startCountdown(currentTime);
        toggleAviso(true);
      }
    } else {
      alert('Por favor, digite um CPF válido.');
    }
  });

  initializeInput();
});


function legitimuzLinkOn() {
  $("#brand").css({
    textDecoration: 'underline',
    cursor: 'pointer'
  });
}

function legitimuzLinkOut() {
  $("#brand").css('textDecoration', 'none');
}

function legitimuzLink() {
  window.open("https://legitimuz.com/", "_blank");
}
