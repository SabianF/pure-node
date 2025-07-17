{
  /**
   *
   * @param {Event} event
   */
  function alertMe(event) {
    const found_table = document.getElementById("table_id_one");
    if (found_table) {
      alert(`Table JS works!: ${found_table.id}`);
      found_table = null;
    } else {
      document.removeEventListener("DOMContentLoaded", alertMe);
    }
  }

  document.addEventListener("DOMContentLoaded", alertMe);
}
